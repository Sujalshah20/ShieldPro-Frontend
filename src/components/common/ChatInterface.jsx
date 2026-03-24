import React, { useState, useEffect, useRef } from "react";
import { Send, User as UserIcon, Shield, Zap, Terminal, Activity, Lock, ChevronUp, Cpu } from "lucide-react";
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
            <div className="flex-1 overflow-y-auto p-6 md:p-14 space-y-12 no-scrollbar scroll-smooth relative">
                {/* Decorative Grid */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000000 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />

                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-1000 relative z-10">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-black/5 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="w-24 h-24 bg-black rounded-[2.5rem] flex items-center justify-center text-white border-2 border-white/10 shadow-3xl relative z-10 group-hover:rotate-12 transition-transform">
                                <Activity size={40} className="animate-pulse" strokeWidth={3} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[12px] font-black uppercase tracking-[6px] text-black italic">Mission Manifest: Clear</p>
                            <p className="text-[10px] font-black text-black opacity-30 uppercase tracking-[4px] leading-relaxed italic max-w-[280px] mx-auto">System nodes have stabilized. Awaiting initial signal transmission from terminal.</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.sender._id === currentUser._id;
                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                key={idx} 
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex gap-8 max-w-[90%] md:max-w-[75%] ${isMe ? 'flex-row-reverse text-right' : 'text-left'}`}>
                                    {/* Avatar Node */}
                                    <div className="flex-shrink-0 pt-2">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-3xl border-2 transition-all duration-500 hover:rotate-12 relative overflow-hidden ${
                                            isMe ? 'bg-black border-black text-white' : 'bg-slate-50 border-slate-100 text-black'
                                        }`}>
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                            {isMe ? <Zap size={22} strokeWidth={3} fill="currentColor" /> : <Terminal size={22} strokeWidth={3} />}
                                        </div>
                                    </div>

                                    {/* Message Payload */}
                                    <div className={`space-y-4 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                        <div className={`p-8 md:p-10 rounded-[3rem] shadow-3xl relative overflow-hidden group transition-all duration-500 ${isMe
                                                ? 'bg-black text-white rounded-tr-none border-t-8 border-white/5'
                                                : 'bg-white border-2 border-slate-50 rounded-tl-none text-black'
                                            }`}>
                                            {/* Decorative Element */}
                                            {isMe && <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none group-hover:scale-125 transition-transform duration-1000"><Shield size={100} strokeWidth={1} /></div>}
                                            
                                            <p className="relative z-10 text-[13px] md:text-sm font-black uppercase tracking-[2px] leading-relaxed whitespace-pre-wrap italic opacity-90">
                                                {msg.content}
                                            </p>
                                        </div>
                                            <div className={`flex items-center gap-4 px-4 text-[9px] font-black uppercase tracking-[4px] opacity-30 italic ${isMe ? 'flex-row-reverse text-right' : ''}`}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${isMe ? 'bg-black' : 'bg-slate-200'}`} />
                                                <span className="text-black">{isMe ? 'FIELD_OPERATIVE_ALPHA' : 'CENTRAL_COMMAND_NODE'}</span>
                                            </div>
                                            <div className="w-px h-3 bg-slate-300" />
                                            <span className="text-black opacity-30 font-black text-[9px] italic uppercase tracking-widest leading-none">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </span>
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
            <form onSubmit={handleSend} className="p-8 md:p-12 bg-slate-50/50 backdrop-blur-xl border-t-2 border-slate-50 relative z-20">
                <div className="max-w-5xl mx-auto flex gap-6 relative">
                    <div className="flex-1 relative group/input">
                        <div className="absolute left-10 top-1/2 -translate-y-1/2 flex items-center gap-4 text-slate-300 group-focus-within/input:text-black transition-all">
                             <Terminal size={22} strokeWidth={3} />
                             <div className="w-px h-6 bg-slate-100 group-focus-within/input:bg-black/10" />
                        </div>
                        <input
                            type="text"
                            placeholder="ENCODE SIGNAL PAYLOAD..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="w-full pl-24 pr-10 h-20 bg-white border-2 border-slate-50 rounded-[2rem] focus:border-black outline-none font-black text-[12px] uppercase tracking-[4px] text-black shadow-inner transition-all focus:ring-8 focus:ring-black/5 italic"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="w-24 h-20 bg-black text-white rounded-[2rem] shadow-3xl flex items-center justify-center transition-all hover:bg-black/90 active:scale-95 disabled:opacity-30 disabled:grayscale group relative overflow-hidden border-b-4 border-white/10"
                    >
                         <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                        <Send size={32} strokeWidth={3} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform relative z-10" />
                    </button>
                    
                    <div className="absolute -top-12 left-10 flex items-center gap-6 opacity-40">
                     <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[4px] text-black/40 italic">
                            <Cpu size={12} strokeWidth={3} /> Processor: Active
                         </div>
                         <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[4px] text-black/40 italic">
                            <Activity size={12} strokeWidth={3} /> Stream: Online
                         </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-4 px-6 py-2 bg-white/50 border border-slate-100 rounded-full shadow-sm">
                        <p className="text-[8px] font-black uppercase tracking-[5px] text-black opacity-30 flex items-center gap-3 italic">
                            <Lock size={12} strokeWidth={3} className="text-black/20" /> End-to-End Quantum Encryption Protocol Active
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;
