import React, { useState, useEffect, useRef } from "react";
import { Send, User as UserIcon } from "lucide-react";

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
        <div className="chat-interface flex flex-col h-[500px] bg-white dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10 overflow-hidden shadow-sm">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 pt-4">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-40 text-center space-y-2">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center">
                            <Send size={20} />
                        </div>
                        <p className="text-sm">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.sender._id === currentUser._id;
                        return (
                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-3 max-w-[80%] ${isMe ? 'flex-row-reverse' : ''}`}>
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <UserIcon size={14} className={isMe ? 'text-blue-500' : 'text-slate-500'} />
                                    </div>
                                    <div className={`p-4 rounded-2xl text-sm ${isMe
                                            ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-100 dark:shadow-none'
                                            : 'bg-white dark:bg-white/10 border border-slate-100 dark:border-white/5 rounded-tl-none'
                                        }`}>
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                        <div className={`text-[10px] mt-2 opacity-50 ${isMe ? 'text-right' : 'text-left'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/10 flex gap-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                    type="submit"
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;
