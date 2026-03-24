import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import ChatInterface from "../../components/common/ChatInterface";
import { 
    MessageSquare, Users, Search, Plus, 
    User as UserIcon, Shield, Zap, Activity, 
    Lock, Fingerprint, Terminal, Compass, 
    Cpu, Globe, ChevronRight, Signal, Layers, RefreshCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../../components/common/Reveal";

const MessagesPage = () => {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch all contacts (Agents/Admins for Customers, Everyone else for others)
    const { data: users = [], isLoading: usersLoading } = useQuery({
        queryKey: ['chatUsers', user?.token],
        queryFn: async () => {
            const allUsers = await api.get('/auth/users', user.token);
            const userList = Array.isArray(allUsers) ? allUsers : [];
            return userList.filter(u => u._id !== user._id);
        },
        enabled: !!user?.token
    });

    // Fetch messages
    const { data: allMessages = [] } = useQuery({
        queryKey: ['messages', user?.token],
        queryFn: () => api.get('/messages', user.token),
        enabled: !!user?.token,
        refetchInterval: 5000 // Polling for new messages
    });

    // Send message mutation
    const sendMessageMutation = useMutation({
        mutationFn: (msgData) => api.post('/messages', msgData, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['messages']);
        }
    });

    const handleSendMessage = (content) => {
        if (!selectedUser) return;
        sendMessageMutation.mutate({
            receiverId: selectedUser._id,
            content
        });
    };

    const safeAllMessages = Array.isArray(allMessages) ? allMessages : [];
    const conversationMessages = selectedUser ? safeAllMessages.filter(m =>
        (m.sender?._id === selectedUser._id && m.receiver?._id === user._id) ||
        (m.sender?._id === user._id && m.receiver?._id === selectedUser._id)
    ).reverse() : [];

    const safeUsers = Array.isArray(users) ? users : [];
    const filteredUsers = safeUsers.filter(u =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-12 h-full flex flex-col font-sans px-4">
            {/* Mission Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                <div>
                     <h1 className="text-3xl font-bold text-[#134e8d] flex items-center gap-4">
                        Secure Messaging
                    </h1>
                    <p className="max-w-md text-slate-500 font-medium leading-relaxed mt-2">Connect with ShieldPro agents and administrators through our encrypted communication network.</p>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                     <div className="flex items-center gap-4 bg-blue-50/50 px-6 py-2.5 rounded-full border border-blue-100/50 shadow-sm">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse" />
                        <span className="text-[10px] font-bold text-[#134e8d] uppercase tracking-wider opacity-60">ENCRYPTION: ACTIVE</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 flex-1 min-h-[750px] pb-10">
                {/* Contact Manifest (Sidebar) */}
                <div className="xl:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden group relative">
                    <div className="p-8 border-b border-slate-50 relative overflow-hidden bg-slate-50/30">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:rotate-45 transition-transform duration-[4000ms] pointer-events-none">
                             <Compass size={180} />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contacts</h3>
                                <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 cursor-pointer hover:bg-[#134e8d] hover:text-white transition-all text-[#134e8d]">
                                    <Plus size={18} strokeWidth={2.5} />
                                </div>
                            </div>
                            <div className="relative group/search">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-[#134e8d] transition-colors">
                                    <Search size={18} strokeWidth={2.5} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search contacts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-14 pr-6 h-14 rounded-2xl bg-white border border-slate-100 focus:border-[#134e8d] outline-none font-medium text-sm text-slate-700 shadow-sm transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar py-6 px-4 space-y-3">
                        {usersLoading ? (
                             <div className="p-12 text-center flex flex-col items-center gap-4">
                                <RefreshCcw size={32} className="text-[#134e8d]/20 animate-spin" strokeWidth={2.5} />
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Loading contacts...</p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="p-16 text-center space-y-4">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto border border-slate-100">
                                    <Search size={32} strokeWidth={2} />
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">No contacts found</p>
                            </div>
                        ) : (
                            filteredUsers.map(u => (
                                <button
                                    key={u._id}
                                    onClick={() => setSelectedUser(u)}
                                    className={`w-full p-4 flex items-center gap-4 rounded-2xl transition-all duration-300 relative group/item ${
                                        selectedUser?._id === u._id 
                                        ? 'bg-blue-50 text-[#134e8d] shadow-sm border border-blue-100' 
                                        : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                                    }`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                                            selectedUser?._id === u._id ? 'bg-white border-blue-200 text-[#134e8d]' : 'bg-white border-slate-100 text-slate-400 group-hover/item:text-[#134e8d]'
                                        }`}>
                                            <UserIcon size={24} strokeWidth={2} />
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className={`font-bold text-sm truncate mb-0.5 ${selectedUser?._id === u._id ? 'text-[#134e8d]' : 'text-slate-800'}`}>{u.name}</div>
                                        <div className="flex items-center gap-2">
                                            <div className={`text-[10px] font-bold uppercase tracking-tight opacity-50`}>
                                                {u.role}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} strokeWidth={2.5} className={selectedUser?._id === u._id ? 'text-[#134e8d]/40' : 'text-slate-200'} />
                                </button>
                            ))
                        )}
                    </div>
                    
                    <div className="p-8 bg-slate-50/50 border-t border-slate-50">
                         <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <Fingerprint size={16} strokeWidth={2.5} /> Secure End-to-End Encryption
                         </div>
                    </div>
                </div>

                {/* Secure Communication Chassis */}
                <div className="xl:col-span-8 h-full relative group min-h-[750px]">
                    <AnimatePresence mode="wait">
                        {selectedUser ? (
                            <motion.div 
                                key={selectedUser._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="h-full flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden relative"
                            >
                                {/* Stream Header */}
                                <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20 relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-xl bg-[#134e8d] flex items-center justify-center text-white shadow-md border border-white/10 group/header">
                                            <Terminal size={24} strokeWidth={2.5} className="group-hover/header:rotate-12 transition-transform duration-500" />
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold text-slate-800 flex items-center gap-3 leading-none mb-2">
                                                {selectedUser.name} <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                <Layers size={14} strokeWidth={2.5} className="opacity-50" /> Secure Channel • Online
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden lg:flex items-center gap-6 pr-4">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Ident</span>
                                            <span className="text-xs font-bold text-slate-400">#{selectedUser._id.slice(-8).toUpperCase()}</span>
                                        </div>
                                        <div className="w-px h-10 bg-slate-100" />
                                        <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                            <Lock size={18} strokeWidth={2.5} />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Message Stream */}
                                <div className="flex-1 min-h-0 relative z-10 chat-container-theme">
                                    <ChatInterface
                                        messages={conversationMessages}
                                        currentUser={user}
                                        onSendMessage={handleSendMessage}
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full bg-slate-50/30 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-20 relative overflow-hidden group shadow-inner"
                            >
                                <div className="absolute top-[-10%] left-[-10%] opacity-[0.02] pointer-events-none transition-transform duration-[10000ms] group-hover:rotate-45">
                                    <Globe size={800} strokeWidth={1} />
                                </div>
                                
                                <div className="relative z-10 space-y-10 flex flex-col items-center">
                                    <div className="relative group/wait">
                                        <div className="absolute inset-0 bg-blue-100 rounded-3xl blur-3xl group-hover/wait:blur-4xl transition-all duration-1000 opacity-50" />
                                        <div className="w-32 h-32 bg-[#134e8d] rounded-[2.5rem] flex items-center justify-center text-white shadow-xl border border-white/10 relative z-10 transition-transform group-hover/wait:scale-105 duration-500">
                                             <MessageSquare size={48} strokeWidth={2.5} />
                                        </div>
                                    </div>
                                    <div className="space-y-4 max-w-sm">
                                        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">Select a conversation</h3>
                                        <p className="text-sm font-medium text-slate-400 leading-relaxed px-6">Choose a contact from the list to start a secure communication session.</p>
                                    </div>
                                    <div className="flex items-center gap-12 pt-8 opacity-20 group-hover:opacity-40 transition-opacity">
                                         <div className="flex flex-col items-center gap-3">
                                            <Cpu size={20} strokeWidth={2.5} />
                                            <span className="text-[9px] font-bold uppercase tracking-wider">Sync</span>
                                         </div>
                                         <div className="flex flex-col items-center gap-3">
                                            <Shield size={20} strokeWidth={2.5} />
                                            <span className="text-[9px] font-bold uppercase tracking-wider">Protect</span>
                                         </div>
                                         <div className="flex flex-col items-center gap-3">
                                            <Zap size={20} strokeWidth={2.5} />
                                            <span className="text-[9px] font-bold uppercase tracking-wider">Secure</span>
                                         </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex justify-center flex-wrap gap-12 opacity-40 pt-10 pb-12 border-t border-slate-100">
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <Fingerprint size={16} strokeWidth={2} /> Verified: {user?.id?.slice(-8).toUpperCase()}
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <Layers size={16} strokeWidth={2} /> System Stable
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <Zap size={16} strokeWidth={2} /> Multi-Channel Sync
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
