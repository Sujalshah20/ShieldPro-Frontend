import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import ChatInterface from "../../components/common/ChatInterface";
import { 
    MessageSquare, Users, Search, Plus, 
    User as UserIcon, Shield, Zap, Activity, 
    Lock, Fingerprint, Terminal, Compass, 
    Cpu, Globe, ChevronRight, Signal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../../components/common/Reveal";

const MessagesPage = () => {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch all contacts (Agents/Admins for Customers, Everyone else for others)
    const { data: users = [] } = useQuery({
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
        <div className="messages-page p-4 md:p-8 bg-[#dae5e5] min-h-screen font-display">
            {/* Tactical Header */}
            <Reveal width="100%" direction="down">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-6 bg-[#0082a1] rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[4px] text-slate-500">Signal Intelligence Hub</span>
                        </div>
                        <h1 className="text-3xl font-black text-[#012b3f] uppercase tracking-tight italic">
                            Secure_Uplink
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#012b3f]">Encryption_AES-4096: ON</span>
                        </div>
                    </div>
                </div>
            </Reveal>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-[750px] relative z-10">
                {/* Contact Manifest (Sidebar) */}
                <div className="xl:col-span-1 bg-white rounded-[3rem] border border-white shadow-2xl flex flex-col overflow-hidden group">
                    <div className="p-8 border-b border-slate-50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:rotate-12 transition-transform">
                             <Compass size={80} />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Node_Directory</h3>
                                <Plus size={16} className="text-[#0082a1] cursor-pointer hover:rotate-90 transition-transform" />
                            </div>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0082a1] transition-colors" size={14} />
                                <input
                                    type="text"
                                    placeholder="SEARCH COORDINATES..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#0082a1] outline-none font-black text-[9px] uppercase tracking-widest text-[#012b3f] shadow-inner transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-2 space-y-1">
                        {filteredUsers.length === 0 ? (
                            <div className="p-12 text-center">
                                <Search size={32} className="mx-auto text-slate-100 mb-4" />
                                <p className="text-[9px] font-black uppercase tracking-[3px] text-slate-300">No active nodes identified</p>
                            </div>
                        ) : (
                            filteredUsers.map(u => (
                                <button
                                    key={u._id}
                                    onClick={() => setSelectedUser(u)}
                                    className={`w-full p-5 flex items-center gap-5 rounded-[2rem] transition-all relative group/item mb-1 ${
                                        selectedUser?._id === u._id 
                                        ? 'bg-[#012b3f] text-[#0082a1] shadow-2xl scale-[1.02] z-10' 
                                        : 'hover:bg-slate-50 text-slate-500'
                                    }`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xl transition-all duration-500 ${
                                            selectedUser?._id === u._id ? 'bg-[#0082a1] border-white/10 text-[#012b3f]' : 'bg-white border-slate-100 group-hover/item:rotate-12 group-hover/item:bg-[#012b3f] group-hover/item:text-white'
                                        }`}>
                                            <UserIcon size={22} strokeWidth={selectedUser?._id === u._id ? 3 : 2} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow-sm shadow-emerald-500/20" />
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className={`font-black text-[11px] uppercase tracking-widest truncate mb-1 ${selectedUser?._id === u._id ? 'text-white' : 'text-[#012b3f]'}`}>{u.name}</div>
                                        <div className={`text-[8px] font-black uppercase tracking-[3px] opacity-40 italic ${selectedUser?._id === u._id ? 'text-[#0082a1]' : ''}`}>
                                            OPERATIVE // {u.role}
                                        </div>
                                    </div>
                                    {selectedUser?._id === u._id && (
                                        <ChevronRight size={16} strokeWidth={4} />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                    
                    <div className="p-8 bg-slate-50/50 border-t border-slate-100">
                         <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[4px] text-slate-300">
                            <Fingerprint size={16} /> Identity_Validated
                         </div>
                    </div>
                </div>

                {/* Secure Communication Chassis */}
                <div className="xl:col-span-3 h-full relative group">
                    {selectedUser ? (
                        <div className="h-full flex flex-col bg-white rounded-[3.5rem] border border-white shadow-2xl overflow-hidden relative">
                            {/* Visual Ambiance */}
                            <div className="absolute top-0 right-0 p-20 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-[5000ms]">
                                 <Signal size={300} className="text-[#012b3f]" />
                            </div>

                            {/* Stream Header */}
                            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30 relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-[#012b3f] flex items-center justify-center text-[#0082a1] shadow-2xl border border-white/5">
                                        <Terminal size={24} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <div className="text-xl font-black text-[#012b3f] uppercase tracking-tight italic flex items-center gap-3">
                                            {selectedUser.name} <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        </div>
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-[4px] mt-1 shrink-0">
                                            SECTOR_COMMUNICATION // SYNC_STABLE
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center gap-6 pr-4">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-[3px] mb-1">DATA_KEY</span>
                                        <span className="text-[10px] font-black text-[#012b3f] tracking-widest">#{selectedUser._id.slice(-6).toUpperCase()}</span>
                                    </div>
                                    <div className="w-px h-8 bg-slate-200" />
                                    <Lock size={18} className="text-[#0082a1]" strokeWidth={3} />
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
                        </div>
                    ) : (
                        <div className="h-full bg-white rounded-[4rem] border border-white shadow-2xl flex flex-col items-center justify-center text-center p-20 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[#012b3f]/[0.02] pointer-events-none" />
                            <div className="absolute top-[-20%] left-[-10%] opacity-[0.05] pointer-events-none transition-transform duration-[8000ms] group-hover:rotate-45">
                                <Globe size={600} />
                            </div>
                            
                            <div className="relative z-10 space-y-10 flex flex-col items-center">
                                <div className="w-32 h-32 bg-[#012b3f] rounded-[2rem] flex items-center justify-center text-[#0082a1] shadow-2xl border border-white/5 animate-pulse relative">
                                     <div className="absolute inset-0 bg-[#0082a1]/20 rounded-[2rem] blur-2xl flex-shrink-0" />
                                     <MessageSquare size={56} className="relative z-10" strokeWidth={2.5} />
                                </div>
                                <div className="space-y-4 max-w-md">
                                    <h3 className="text-4xl font-black text-[#012b3f] uppercase tracking-tighter italic leading-none">Awaiting <span className="text-[#0082a1]">Uplink</span></h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[5px] leading-loose">Initialize a secure communication vector by selecting an active node from the manifest.</p>
                                </div>
                                <div className="flex items-center gap-12 pt-10 opacity-20">
                                     <div className="flex flex-col items-center gap-3">
                                        <Cpu size={20} />
                                        <span className="text-[7px] font-black uppercase tracking-[3px]">Logic_Core</span>
                                     </div>
                                     <div className="flex flex-col items-center gap-3">
                                        <Shield size={20} />
                                        <span className="text-[7px] font-black uppercase tracking-[3px]">Barrier_Sync</span>
                                     </div>
                                     <div className="flex flex-col items-center gap-3">
                                        <Zap size={20} />
                                        <span className="text-[7px] font-black uppercase tracking-[3px]">Fast_Uplink</span>
                                     </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Atmosphere Shadows */}
            <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[#0082a1]/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-[#012b3f]/5 rounded-full blur-[120px] pointer-events-none" />
        </div>
    );
};

export default MessagesPage;
