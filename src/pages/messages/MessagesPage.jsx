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
        <div className="space-y-12 h-full flex flex-col">
            {/* Mission Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                <div>
                     <h1 className="flex items-center gap-4">
                        Secure Uplink <span className="inline-block animate-pulse opacity-50 text-[#007ea7]">_</span>
                    </h1>
                    <p className="max-w-md text-slate-400 italic font-medium leading-relaxed mt-4">Initialize encrypted communication vectors with designated field operatives and command nodes.</p>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                     <div className="flex items-center gap-4 bg-slate-100/50 px-6 py-2.5 rounded-full border border-[#ccdbdc]/30 shadow-inner italic">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981] animate-pulse" />
                        <span className="text-[10px] font-black text-[#003249] uppercase tracking-[4px]">ENCRYPTION_X_AES_512: ACTIVE</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 flex-1 min-h-[750px] pb-10">
                {/* Contact Manifest (Sidebar) */}
                <div className="xl:col-span-4 bg-white rounded-[3.5rem] border-2 border-slate-50 shadow-3xl flex flex-col overflow-hidden group relative">
                    <div className="p-10 border-b-2 border-slate-50 relative overflow-hidden bg-slate-50/30">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:rotate-45 transition-transform duration-[4000ms] pointer-events-none">
                             <Compass size={180} />
                        </div>
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[11px] font-black text-[#003249] uppercase tracking-[6px] italic leading-none">Node_Directory</h3>
                                <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 cursor-pointer hover:bg-[#003249] hover:text-[#007ea7] transition-all">
                                    <Plus size={18} strokeWidth={3} />
                                </div>
                            </div>
                            <div className="relative group/search">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/search:text-[#007ea7] transition-colors">
                                    <Search size={18} strokeWidth={3} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="SEARCH COORDINATES..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-16 pr-6 h-16 rounded-2xl bg-white border border-slate-100 focus:border-[#007ea7] outline-none font-black text-[11px] uppercase tracking-[4px] text-[#003249] shadow-inner transition-all italic"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar py-8 px-4 space-y-4">
                        {usersLoading ? (
                             <div className="p-12 text-center flex flex-col items-center gap-6">
                                <RefreshCcw size={40} className="text-[#007ea7] animate-spin" strokeWidth={3} />
                                <p className="text-[10px] font-black uppercase tracking-[5px] text-slate-300 italic">Syncing node manifest...</p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="p-16 text-center space-y-6">
                                <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mx-auto shadow-inner">
                                    <Search size={40} strokeWidth={2} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[5px] text-slate-300 italic">No active nodes identified in sector</p>
                            </div>
                        ) : (
                            filteredUsers.map(u => (
                                <button
                                    key={u._id}
                                    onClick={() => setSelectedUser(u)}
                                    className={`w-full p-6 flex items-center gap-6 rounded-[2.5rem] transition-all duration-500 relative group/item ${
                                        selectedUser?._id === u._id 
                                        ? 'bg-[#003249] text-white shadow-3xl translate-x-3 border-2 border-[#003249]' 
                                        : 'hover:bg-slate-50 text-slate-500 border-2 border-transparent'
                                    }`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 shadow-2xl transition-all duration-700 ${
                                            selectedUser?._id === u._id ? 'bg-[#007ea7] border-[#007ea7] text-[#003249] rotate-6' : 'bg-white border-slate-50 group-hover/item:rotate-12 group-hover/item:bg-[#003249] group-hover/item:text-white'
                                        }`}>
                                            <UserIcon size={28} strokeWidth={3} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white shadow-sm shadow-emerald-500/20" />
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className={`font-black text-[12px] uppercase tracking-[3px] truncate mb-2 italic ${selectedUser?._id === u._id ? 'text-white' : 'text-[#003249]'}`}>{u.name}</div>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1.5 h-1.5 rounded-full ${selectedUser?._id === u._id ? 'bg-[#007ea7]' : 'bg-slate-200'}`} />
                                            <div className={`text-[9px] font-black uppercase tracking-[4px] italic opacity-40 ${selectedUser?._id === u._id ? 'text-[#007ea7]' : ''}`}>
                                                OPERATIVE // {u.role}
                                            </div>
                                        </div>
                                    </div>
                                    {selectedUser?._id === u._id && (
                                        <ChevronRight size={18} strokeWidth={4} className="text-[#007ea7]" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                    
                    <div className="p-10 bg-slate-50/50 border-t-2 border-slate-50">
                         <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-[5px] text-slate-300 italic">
                            <Fingerprint size={18} strokeWidth={3} /> Identity_Validated Node Registry
                         </div>
                    </div>
                </div>

                {/* Secure Communication Chassis */}
                <div className="xl:col-span-8 h-full relative group min-h-[750px]">
                    <AnimatePresence mode="wait">
                        {selectedUser ? (
                            <motion.div 
                                key={selectedUser._id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="h-full flex flex-col bg-white rounded-[4rem] border-2 border-white/5 shadow-3xl overflow-hidden relative"
                            >
                                {/* Visual Ambiance */}
                                <div className="absolute top-0 right-0 p-24 opacity-[0.02] pointer-events-none group-hover:scale-125 transition-transform duration-[6000ms]">
                                     <Signal size={400} className="text-[#003249] rotate-12" strokeWidth={1} />
                                </div>

                                {/* Stream Header */}
                                <div className="px-12 py-10 border-b-2 border-slate-50 flex items-center justify-between bg-slate-50/20 relative z-10">
                                    <div className="flex items-center gap-8">
                                        <div className="w-20 h-20 rounded-[1.8rem] bg-[#003249] flex items-center justify-center text-[#007ea7] shadow-3xl border border-white/5 relative overflow-hidden group/header">
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#007ea7]/20 to-transparent pointer-events-none" />
                                            <Terminal size={32} strokeWidth={3} className="group-hover/header:rotate-12 transition-transform duration-500" />
                                        </div>
                                        <div>
                                            <div className="text-3xl font-black text-[#003249] uppercase tracking-tighter italic flex items-center gap-5 leading-none mb-3">
                                                {selectedUser.name.toUpperCase()} <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                                            </div>
                                            <div className="flex items-center gap-5">
                                                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[6px] italic leading-none">
                                                    <Layers size={14} strokeWidth={3} className="text-[#007ea7]" /> SECTOR_COMMUNICATION // SYNC_STABLE
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden lg:flex items-center gap-8 pr-6">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-[9px] font-black text-slate-200 uppercase tracking-[5px] italic">DATA_KEY_IDENT</span>
                                            <span className="text-[12px] font-black text-[#003249] tracking-[6px] italic">#{selectedUser._id.slice(-8).toUpperCase()}</span>
                                        </div>
                                        <div className="w-0.5 h-12 bg-slate-100" />
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#007ea7] shadow-inner">
                                            <Lock size={22} strokeWidth={3} />
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
                                className="h-full bg-slate-50/30 rounded-[5rem] border-4 border-dashed border-[#ccdbdc]/30 flex flex-col items-center justify-center text-center p-20 relative overflow-hidden group shadow-inner"
                            >
                                <div className="absolute inset-0 bg-[#003249]/[0.01] pointer-events-none" />
                                <div className="absolute top-[-10%] left-[-10%] opacity-[0.03] pointer-events-none transition-transform duration-[10000ms] group-hover:rotate-45">
                                    <Globe size={800} strokeWidth={1} />
                                </div>
                                
                                <div className="relative z-10 space-y-12 flex flex-col items-center">
                                    <div className="relative group/wait">
                                        <div className="absolute inset-0 bg-[#007ea7]/20 rounded-[3rem] blur-3xl group-hover/wait:blur-4xl transition-all duration-1000" />
                                        <div className="w-40 h-40 bg-[#003249] rounded-[3.5rem] flex items-center justify-center text-[#007ea7] shadow-3xl border-2 border-white/5 relative z-10 animate-pulse-slow">
                                             <MessageSquare size={72} strokeWidth={3} className="group-hover/wait:scale-110 transition-transform duration-700" />
                                        </div>
                                    </div>
                                    <div className="space-y-6 max-w-lg">
                                        <h3 className="text-5xl font-black text-[#003249] uppercase tracking-tighter italic leading-none">Awaiting <span className="text-[#007ea7]">Uplink Signal</span></h3>
                                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-[6px] leading-loose italic">Initialize a secure communication vector by selecting an active node from the manifest grid.</p>
                                    </div>
                                    <div className="flex items-center gap-16 pt-12 opacity-30 group-hover:opacity-60 transition-opacity">
                                         <div className="flex flex-col items-center gap-4">
                                            <Cpu size={24} strokeWidth={3} />
                                            <span className="text-[9px] font-black uppercase tracking-[5px] italic">Logic_Core</span>
                                         </div>
                                         <div className="flex flex-col items-center gap-4">
                                            <Shield size={24} strokeWidth={3} />
                                            <span className="text-[9px] font-black uppercase tracking-[5px] italic">Barrier_Sync</span>
                                         </div>
                                         <div className="flex flex-col items-center gap-4">
                                            <Zap size={24} strokeWidth={3} />
                                            <span className="text-[9px] font-black uppercase tracking-[5px] italic">Fast_Uplink</span>
                                         </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex justify-center flex-wrap gap-16 opacity-30 pt-10 pb-12 border-t border-[#ccdbdc]/20">
                <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                    <Fingerprint size={18} strokeWidth={3} /> Signal_Verified: {user?.id?.slice(-8).toUpperCase()}
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                    <Layers size={18} strokeWidth={3} /> Grid_Sync_Stable
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black text-[#003249] uppercase tracking-[6px] italic">
                    <Zap size={18} strokeWidth={3} /> Latency: 0.04ms
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
