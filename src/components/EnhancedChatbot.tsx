import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  ShoppingBag,
  X,
  Minimize2,
  Maximize2,
  Heart,
  Eye,
  Zap,
  Brain,
  Mic,
  MicOff
} from 'lucide-react';
import { Product } from '@/data/products';
import { advancedChatbot, ChatMessage, UserContext } from '@/services/advancedChatbot';

interface EnhancedChatbotProps {
  products: Product[];
  onProductRecommend?: (products: Product[]) => void;
  onProductView?: (product: Product) => void;
}

export const EnhancedChatbot: React.FC<EnhancedChatbotProps> = ({
  products,
  onProductRecommend,
  onProductView
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Initialize chatbot and load context
  useEffect(() => {
    const context = advancedChatbot.getUserContext();
    setUserContext(context);
    
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        text: `Hi${context?.name ? ` ${context.name}` : ''}! 👋 I'm ARIA, your Advanced Retail Intelligence Assistant. I can help you:\n\n🔍 Find products with natural language\n💡 Get personalized recommendations\n📊 Compare products intelligently\n💰 Find the best deals\n🎯 Understand your shopping patterns\n\nWhat would you like to explore today?`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = userContext?.preferences.language === 'hi' ? 'hi-IN' : 'en-IN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [userContext]);

  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Simulate thinking time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await advancedChatbot.processMessage(text.trim(), products);
      
      setMessages(prev => [...prev, response]);

      // Handle product recommendations
      if (response.metadata?.products && response.metadata.products.length > 0) {
        onProductRecommend?.(response.metadata.products);
      }

      // Update user context
      const updatedContext = advancedChatbot.getUserContext();
      setUserContext(updatedContext);

    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble processing your request right now. Please try again or rephrase your question!",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickResponse = (response: string) => {
    handleSendMessage(response);
  };

  const handleProductClick = (product: Product) => {
    onProductView?.(product);
    advancedChatbot.addToHistory({ type: 'viewed', value: product.id });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getQuickResponses = () => {
    return advancedChatbot.getQuickResponses();
  };

  const renderMessage = (message: ChatMessage) => {
    return (
      <div
        key={message.id}
        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group`}
      >
        <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm border transition-all duration-200 ${
          message.sender === 'user'
            ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white border-purple-300/50 shadow-purple-500/10'
            : 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 border-gray-200/50 dark:border-gray-600/50 shadow-gray-500/5'
        } hover:shadow-lg hover:scale-[1.02]`}>
          <div className="flex items-start gap-3">
            <Avatar className={`h-9 w-9 flex-shrink-0 ring-2 transition-all duration-200 ${
              message.sender === 'user' 
                ? 'ring-white/30' 
                : 'ring-purple-100 dark:ring-purple-800'
            }`}>
              <AvatarFallback className={`${
                message.sender === 'user' 
                  ? 'bg-white/20 text-white backdrop-blur-sm' 
                  : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
              }`}>
                {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p className={`text-sm whitespace-pre-line leading-relaxed ${
                message.sender === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-200'
              }`}>
                {message.text}
              </p>
              
              {/* Enhanced Product Cards */}
              {message.metadata?.products && message.metadata.products.length > 0 && (
                <div className="mt-4 space-y-3">
                  {message.metadata.products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 dark:border-gray-600/50 
                        cursor-pointer hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 
                        hover:shadow-md hover:scale-[1.02] group/product"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 
                          rounded-lg flex items-center justify-center flex-shrink-0 group-hover/product:scale-110 transition-transform">
                          <ShoppingBag className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm line-clamp-1 group-hover/product:text-purple-600 dark:group-hover/product:text-purple-400 transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-purple-600 dark:text-purple-400">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-purple-100 dark:hover:bg-purple-900">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900">
                                <Heart className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Enhanced Action Buttons */}
              {message.metadata?.suggestions && message.metadata.suggestions.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {message.metadata.suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      className={`text-xs h-8 transition-all duration-200 ${
                        message.sender === 'user'
                          ? 'bg-white/10 hover:bg-white/20 border-white/30 text-white hover:scale-105'
                          : 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:scale-105'
                      }`}
                      onClick={() => handleQuickResponse(suggestion)}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                <p className={`text-xs transition-opacity group-hover:opacity-100 ${
                  message.sender === 'user' ? 'text-white/70 opacity-70' : 'text-gray-500 dark:text-gray-400 opacity-70'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
                
                {message.metadata?.confidence && (
                  <Badge variant="secondary" className={`text-xs transition-all duration-200 ${
                    message.sender === 'user'
                      ? 'bg-white/20 text-white/90 border-0'
                      : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700'
                  }`}>
                    <Brain className="h-3 w-3 mr-1" />
                    {message.metadata.confidence}% confident
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 
            hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-700 
            shadow-2xl hover:shadow-indigo-500/25 transition-all duration-500 group
            border-4 border-white dark:border-gray-800 backdrop-blur-sm
            hover:scale-110 active:scale-95"
          size="lg"
        >
          <MessageCircle className="h-8 w-8 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
        </Button>
        
        {/* Enhanced notification indicator */}
        <div className="absolute -top-2 -right-2 h-8 w-8 bg-gradient-to-br from-red-500 to-orange-500 
          rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <Sparkles className="h-4 w-4 text-white drop-shadow" />
        </div>
        
        {/* Floating helper text */}
        <div className="absolute bottom-20 right-0 transform translate-x-1/2 opacity-0 group-hover:opacity-100 
          transition-all duration-300 pointer-events-none">
          <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
            Ask me anything!
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 
              border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-[420px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl 
      shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-50 
      transition-all duration-500 ease-out rounded-2xl overflow-hidden
      ${isMinimized ? 'h-20' : 'h-[750px]'} 
      hover:shadow-purple-500/10 dark:hover:shadow-purple-400/10`}>
      
      {/* Enhanced Header */}
      <CardHeader className="pb-3 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <CardTitle className="text-lg font-bold flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Bot className="h-6 w-6 text-white drop-shadow" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white 
                animate-pulse shadow-lg"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-white drop-shadow">ARIA - Retail Assistant</span>
              <span className="text-xs text-white/80 font-normal">Advanced Intelligence</span>
            </div>
          </CardTitle>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-9 w-9 p-0 hover:bg-white/20 rounded-xl transition-all duration-200 group"
            >
              {isMinimized ? 
                <Maximize2 className="h-4 w-4 group-hover:scale-110 transition-transform" /> : 
                <Minimize2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
              }
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="h-9 w-9 p-0 hover:bg-white/20 rounded-xl transition-all duration-200 group"
            >
              <X className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Enhanced Content */}
      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(750px-100px)] bg-gradient-to-b from-gray-50/50 to-white 
          dark:from-gray-800/50 dark:to-gray-900">
          <div className="flex-1 flex flex-col px-3">
              {/* Enhanced Messages Area */}
              <ScrollArea className="flex-1 py-4">
                <div className="space-y-4 pr-4">
                  {messages.map(renderMessage)}
                  
                  {/* Enhanced Typing indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 
                        rounded-2xl p-4 max-w-[85%] shadow-sm border border-gray-200/50 dark:border-gray-600/50">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 ring-2 ring-purple-100 dark:ring-purple-800">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Enhanced Quick Responses */}
              {messages.length <= 2 && (
                <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 
                  bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 
                  backdrop-blur-sm rounded-t-xl">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Zap className="h-3 w-3 text-purple-500" />
                    Quick suggestions:
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {getQuickResponses().slice(0, 3).map((response, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickResponse(response)}
                        className="text-xs h-9 justify-start bg-white/80 dark:bg-gray-800/80 
                          hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 
                          dark:hover:from-purple-900/30 dark:hover:to-pink-900/30
                          border-gray-200/50 dark:border-gray-600/50 
                          hover:border-purple-300 dark:hover:border-purple-600
                          transition-all duration-200 group backdrop-blur-sm"
                      >
                        <Sparkles className="h-3 w-3 mr-2 text-purple-500 group-hover:rotate-12 transition-transform" />
                        {response}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Input Area */}
              <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 
                bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about shopping..."
                      className="pr-12 h-12 rounded-xl border-gray-200/50 dark:border-gray-600/50 
                        bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
                        focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 
                        transition-all duration-200 text-sm"
                      disabled={isLoading}
                    />
                    
                    {recognitionRef.current && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleVoiceInput}
                        className={`absolute right-1 top-1 h-10 w-10 p-0 rounded-lg transition-all duration-200 ${
                          isListening 
                            ? 'text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30' 
                            : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                        }`}
                      >
                        {isListening ? 
                          <MicOff className="h-4 w-4 animate-pulse" /> : 
                          <Mic className="h-4 w-4" />
                        }
                      </Button>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 
                      hover:from-indigo-700 hover:to-cyan-700 shadow-lg hover:shadow-indigo-500/25 
                      transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed
                      hover:scale-105 active:scale-95"
                  >
                    {isLoading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Send className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    )}
                  </Button>
                </div>
              </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};