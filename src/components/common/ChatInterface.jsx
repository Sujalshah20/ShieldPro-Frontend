import React, { useState, useEffect, useRef } from "react";
import { Send, User as UserIcon, Shield, Zap, Terminal, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ChatInterface = ({ messages, currentUser, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        onSendMessage(newMessage);
        setNewMessage("");
    };

    return (
        <div className="chat-interface flex flex-col h-full bg-transparent overflow-hidden">
            {/* Thread Container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 no-scrollbar scroll-smooth">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-40 text-center space-y-6">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-[#0082a1] border border-slate-100 shadow-inner">
                            <Activity size={32} className="animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-[5px] text-[#012b3f]">Mission Manifest: Clear</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">System awaiting initial signal transmission.</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.sender._id === currentUser._id;
                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                key={idx} 
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex gap-6 max-w-[85%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : ''}`}>
                                    {/* Avatar Node */}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xl border border-white/50 transition-transform hover:rotate-12 ${
                                        isMe ? 'bg-[#0082a1] text-[#012b3f]' : 'bg-[#012b3f] text-white'
                                    }`}>
                                        {isMe ? <Zap size={18} strokeWidth={3} fill="currentColor" /> : <Terminal size={18} strokeWidth={3} />}
                                    </div>

                                    {/* Message Payload */}
                                    <div className="space-y-2">
                                        <div className={`p-6 md:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group ${isMe
                                                ? 'bg-[#012b3f] text-white rounded-tr-none border border-white/5'
                                                : 'bg-white border border-slate-100 rounded-tl-none text-[#012b3f]'
                                            }`}>
                                            {/* Decorative Element */}
                                            {isMe && <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none transition-transform group-hover:scale-125"><Shield size={60} /></div>}
                                            
                                            <p className="relative z-10 text-[11px] md:text-xs font-bold uppercase tracking-widest leading-relaxed whitespace-pre-wrap">
                                                {msg.content}
                                            </p>
                                        </div>
                                        <div className={`flex items-center gap-3 px-2 text-[8px] font-black uppercase tracking-[3px] opacity-40 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <span className={isMe ? 'text-[#0082a1]' : 'text-[#012b3f]'}>{isMe ? 'OPERATIVE_ALPHA' : 'NODE_SIGNAL'}</span>
                                            <div className="w-1 h-1 bg-slate-300 rounded-full" />
                                            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Signal Input Console */}
            <form onSubmit={handleSend} className="p-6 md:p-10 bg-slate-50/80 backdrop-blur-md border-t border-slate-200 relative z-20">
                <div className="max-w-4xl mx-auto flex gap-4">
                    <div className="flex-1 relative group">
                        <Terminal className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#0082a1] transition-colors" />
                        <input
                            type="text"
                            placeholder="ENCODE SIGNAL..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="w-full pl-16 pr-8 h-16 bg-white border border-slate-200 rounded-2xl focus:border-[#0082a1] outline-none font-black text-[10px] uppercase tracking-widest text-[#012b3f] shadow-inner transition-all focus:ring-4 focus:ring-[#0082a1]/5"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="w-20 h-16 bg-[#012b3f] text-[#0082a1] rounded-2xl shadow-xl flex items-center justify-center transition-all hover:bg-[#0082a1] hover:text-white active:scale-95 disabled:opacity-20 disabled:grayscale group"
                    >
                        <Send size={24} strokeWidth={3} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>
                <div className="mt-4 flex justify-center">
                    <p className="text-[7px] font-black uppercase tracking-[5px] text-slate-300 flex items-center gap-2">
                        <Lock size={10} /> End-to-End Quantum Encryption Protocol Active
                    </p>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;
