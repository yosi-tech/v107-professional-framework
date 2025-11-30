
import React, { useState, useEffect, useRef } from "react";
import { agentSDK } from "@/agents";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Send, X, Loader2, MessageCircle, Plus, ChevronLeft, HelpCircle, FileText, Lightbulb, Target, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import MessageBubble from "./MessageBubble";
import { Toaster, toast } from "sonner";

const CONVERSATIONS_KEY = "aventura_conversations";

const predefinedTopics = [
    {
        id: "what_is_report",
        title: "מה כולל הדו״ח המקצועי?",
        icon: FileText,
        message: "אשמח לדעת מה בדיוק כולל הדו״ח המקצועי של Aventura-107, ומה ההבדל בינו לשאלון החינמי?"
    },
    {
        id: "why_questionnaire",
        title: "למה כדאי למלא את השאלון?",
        icon: Target,
        message: "מעניין אותי להבין איך השאלון יכול לעזור לי, ומה אני אקבל בסוף התהליך?"
    },
    {
        id: "start_business",
        title: "איך מתחילים עסק?",
        icon: Lightbulb,
        message: "אני חושב על לפתוח עסק אבל לא יודע מאיפה להתחיל. מה השלבים הראשונים?"
    },
    {
        id: "pricing_value",
        title: "האם הדו״ח שווה את המחיר?",
        icon: DollarSign,
        message: "אשמח להבין מה הערך שאני אקבל בתמורה ל-299 ₪, ולמה זה לא נעשה על ידי AI?"
    }
];

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentView, setCurrentView] = useState("menu"); // "menu", "conversation"
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isLoadingConversations, setIsLoadingConversations] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    // טעינת שיחות קיימות
    const loadConversations = async () => {
        setIsLoadingConversations(true);
        try {
            const allConversations = await agentSDK.listConversations({
                agent_name: "aventura_advisor"
            });
            setConversations(allConversations || []);
        } catch (error) {
            console.error("Error loading conversations:", error);
        }
        setIsLoadingConversations(false);
    };

    useEffect(() => {
        if (isOpen && currentView === "menu") {
            loadConversations();
        }
    }, [isOpen, currentView]);

    // האזנה לעדכוני שיחה פעילה
    useEffect(() => {
        if (activeConversation?.id && currentView === "conversation") {
            const unsubscribe = agentSDK.subscribeToConversation(activeConversation.id, (data) => {
                setMessages(data.messages);
                if (data.status === 'running') {
                    setIsSending(true);
                } else if (data.status === 'completed' || data.status === 'failed') {
                    setIsSending(false);
                }
            });
            return () => unsubscribe();
        }
    }, [activeConversation, currentView]);

    // פתיחת שיחה קיימת
    const openConversation = async (conversation) => {
        try {
            setActiveConversation(conversation);
            setMessages(conversation.messages || []);
            setCurrentView("conversation");
        } catch (error) {
            console.error("Error opening conversation:", error);
            toast.error("לא ניתן לפתוח את השיחה");
        }
    };

    // יצירת שיחה חדשה
    const createNewConversation = async () => {
        try {
            const newConv = await agentSDK.createConversation({
                agent_name: "aventura_advisor",
                metadata: {
                    name: "שיחה עם מייעץ Aventura",
                },
            });
            
            // הוספת הודעת פתיחה
            await agentSDK.addMessage(newConv, {
                role: "assistant",
                content: "שלום! אני 'מייעץ Aventura', סייען AI ליזמות. איך אני יכול לעזור לך היום? אני כאן כדי לענות על שאלות, להסביר על השאלון, או לעזור לך להתחיל את המסע היזמי שלך.",
            });
            
            setActiveConversation(newConv);
            setCurrentView("conversation");
        } catch (error) {
            console.error("Error creating conversation:", error);
            toast.error("לא ניתן ליצור שיחה חדשה");
        }
    };

    // התחלת שיחה עם נושא מוכן מראש
    const startTopicConversation = async (topic) => {
        try {
            const newConv = await agentSDK.createConversation({
                agent_name: "aventura_advisor",
                metadata: {
                    name: topic.title,
                },
            });
            
            setActiveConversation(newConv);
            setCurrentView("conversation");
            
            // שליחת ההודעה המוכנה מראש
            setIsSending(true);
            await agentSDK.addMessage(newConv, {
                role: "user",
                content: topic.message,
            });
        } catch (error) {
            console.error("Error starting topic conversation:", error);
            toast.error("לא ניתן להתחיל שיחה");
        }
    };

    // שליחת הודעה
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation || isSending) return;

        const messageContent = newMessage;
        setNewMessage("");
        setIsSending(true);

        try {
            await agentSDK.addMessage(activeConversation, {
                role: "user",
                content: messageContent,
            });
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("שגיאה בשליחת ההודעה.");
            setIsSending(false);
        }
    };

    // חזרה לתפריט
    const backToMenu = () => {
        setCurrentView("menu");
        setActiveConversation(null);
        setMessages([]);
        setNewMessage("");
        loadConversations();
    };

    // סגירת הצ'אט
    const closeChat = () => {
        setIsOpen(false);
        // Reset state for next open
        setTimeout(() => {
            setCurrentView("menu");
            setActiveConversation(null);
            setMessages([]);
            setNewMessage("");
        }, 300);
    };

    return (
        <>
            <Toaster position="bottom-center" />
            <div className="fixed bottom-6 left-6 z-50" dir="rtl">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    size="lg"
                    className="rounded-full w-16 h-16 gradient-accent text-white shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center"
                >
                    {isOpen ? <X className="w-7 h-7" /> : <Bot className="w-7 h-7" />}
                </Button>
            </div>

            {isOpen && (
                <div className="fixed bottom-24 left-6 z-50 w-[90vw] max-w-md h-[75vh] bg-surface rounded-2xl shadow-2xl flex flex-col border border-slate-200" dir="rtl">
                    {/* Header */}
                    <div className="p-4 bg-primary text-white rounded-t-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {currentView === "conversation" && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={backToMenu}
                                    className="text-white hover:bg-white/20 w-8 h-8"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                            )}
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">מייעץ Aventura</h3>
                                <p className="text-xs text-slate-300">סייען AI ליזמות</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={closeChat}
                            className="text-white hover:bg-white/20 w-8 h-8"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-background">
                        {currentView === "menu" ? (
                            // Menu View
                            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                <div className="text-center">
                                    <h3 className="text-lg font-bold text-text-primary mb-2">איך אפשר לעזור?</h3>
                                    <p className="text-sm text-text-secondary">בחר נושא או התחל שיחה חדשה</p>
                                </div>

                                {/* נושאים מוכנים מראש */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-text-primary mb-2">נושאים פופולריים</h4>
                                    {predefinedTopics.map((topic) => (
                                        <Card 
                                            key={topic.id} 
                                            className="cursor-pointer hover:bg-slate-100 border-l-4 border-l-accent transition-colors"
                                            onClick={() => startTopicConversation(topic)}
                                        >
                                            <CardContent className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <topic.icon className="w-5 h-5 text-accent" />
                                                    <span className="text-sm font-medium text-text-primary">{topic.title}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* שיחות קיימות */}
                                {conversations.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">שיחות קיימות</h4>
                                        {conversations.slice(0, 3).map((conv) => (
                                            <Card 
                                                key={conv.id} 
                                                className="cursor-pointer hover:bg-gray-50 transition-colors"
                                                onClick={() => openConversation(conv)}
                                            >
                                                <CardContent className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <MessageCircle className="w-4 h-4 text-gray-500" />
                                                        <span className="text-sm">{conv.metadata?.name || "שיחה"}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}

                                {/* שיחה חדשה */}
                                <Button
                                    onClick={createNewConversation}
                                    className="w-full gradient-primary text-white"
                                >
                                    <Plus className="w-4 h-4 ml-2" />
                                    התחל שיחה חדשה
                                </Button>
                            </div>
                        ) : (
                            // Conversation View
                            <>
                                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                    {messages.map((msg, index) => (
                                        <MessageBubble key={index} message={msg} />
                                    ))}
                                    {isSending && messages[messages.length - 1]?.role === 'user' && (
                                        <div className="flex gap-3 my-4 justify-start">
                                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Bot className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="bg-slate-200 rounded-2xl rounded-bl-lg px-4 py-3 flex items-center">
                                                <Loader2 className="w-4 h-4 text-text-secondary animate-spin" />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t border-slate-200 bg-surface">
                                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                        <Textarea
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="כתוב הודעה..."
                                            className="flex-1 resize-none bg-slate-100 border-slate-300 focus:ring-accent text-sm"
                                            rows={1}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage(e);
                                                }
                                            }}
                                        />
                                        <Button 
                                            type="submit" 
                                            size="icon" 
                                            disabled={isSending || !newMessage.trim()}
                                            className="gradient-accent text-white"
                                        >
                                            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        </Button>
                                    </form>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
