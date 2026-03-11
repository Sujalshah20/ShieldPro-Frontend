import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import ChatInterface from "../../components/common/ChatInterface";
import { MessageSquare, Users, Search, Plus, User as UserIcon } from "lucide-react";

const MessagesPage = () => {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch all contacts (Agents/Admins for Customers, Everyone else for others)
    const { data: users = [] } = useQuery({
        queryKey: ['chatUsers', user?.token],
        queryFn: async () => {
            const allUsers = await api.get('/auth/users', user.token); // Need to implement this endpoint
            return allUsers.filter(u => u._id !== user._id);
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

    const conversationMessages = selectedUser ? allMessages.filter(m =>
        (m.sender._id === selectedUser._id && m.receiver._id === user._id) ||
        (m.sender._id === user._id && m.receiver._id === selectedUser._id)
    ).reverse() : [];

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="messages-page p-8 min-h-[calc(100vh-100px)] pt-0">
            <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">Secure Messaging</h2>
                <p className="opacity-70 font-medium">Connect directly with support agents or customers regarding your policies.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
                {/* Users List */}
                <div className="lg:col-span-1 glass rounded-3xl flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-white/5 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredUsers.length === 0 ? (
                            <div className="p-8 text-center opacity-40">No contacts found</div>
                        ) : (
                            filteredUsers.map(u => (
                                <button
                                    key={u._id}
                                    onClick={() => setSelectedUser(u)}
                                    className={`w-full p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left border-b border-slate-50 dark:border-white/5 ${selectedUser?._id === u._id ? 'bg-blue-50 dark:bg-blue-900/10 border-r-4 border-r-blue-600' : ''}`}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center relative flex-shrink-0">
                                        <UserIcon size={24} className="text-slate-400" />
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold truncate">{u.name}</div>
                                        <div className="text-xs opacity-60 uppercase tracking-widest font-medium">{u.role}</div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Section */}
                <div className="lg:col-span-2 relative">
                    {selectedUser ? (
                        <div className="h-full flex flex-col">
                            <div className="glass p-4 rounded-3xl mb-4 flex items-center justify-between border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <UserIcon size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-bold">{selectedUser.name}</div>
                                        <div className="text-xs text-green-500 font-medium">Online</div>
                                    </div>
                                </div>
                                <div className="text-xs opacity-50 font-mono">End-to-End Encrypted</div>
                            </div>
                            <ChatInterface
                                messages={conversationMessages}
                                currentUser={user}
                                onSendMessage={handleSendMessage}
                            />
                        </div>
                    ) : (
                        <div className="glass h-full rounded-3xl flex flex-col items-center justify-center text-center p-12 space-y-4">
                            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/10 rounded-full flex items-center justify-center text-blue-600">
                                <MessageSquare size={40} />
                            </div>
                            <h3 className="text-2xl font-bold">Your Inbox</h3>
                            <p className="opacity-50 max-w-sm">Select a contact from the list to start a secure conversation regarding claims or policy information.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
