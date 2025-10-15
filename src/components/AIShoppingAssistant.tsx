import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  ShoppingBag,
  Lightbulb,
  TrendingUp,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Product } from '@/data/products';
import { geminiAI } from '@/services/geminiAI';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  relatedProducts?: Product[];
}

interface AIShoppingAssistantProps {
  products: Product[];
  onProductRecommend?: (products: Product[]) => void;
}

export const AIShoppingAssistant: React.FC<AIShoppingAssistantProps> = ({
  products,
  onProductRecommend
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: "Hi! I'm your AI shopping assistant 🛍️ I can help you find products, compare options, answer questions, and provide personalized recommendations. What are you looking for today?",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const quickSuggestions = [
    "Find wireless headphones under ₹5000",
    "Compare laptop options",
    "What's trending in electronics?",
    "Best value smartphones",
    "Recommend fitness products"
  ];

  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse = await generateAIResponse(text.trim());
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        relatedProducts: aiResponse.relatedProducts
      };

      setMessages(prev => [...prev, aiMessage]);

      // If AI recommended products, update parent component
      if (aiResponse.relatedProducts && aiResponse.relatedProducts.length > 0) {
        onProductRecommend?.(aiResponse.relatedProducts);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble processing your request right now. Please try again or ask a different question!",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const generateAIResponse = async (userText: string): Promise<{text: string, relatedProducts?: Product[]}> => {
    const lowerText = userText.toLowerCase();

    // Determine the type of query and generate appropriate response
    if (lowerText.includes('find') || lowerText.includes('search') || lowerText.includes('looking for')) {
      // Product search query
      const searchResults = await geminiAI.generateSmartSearchResults(userText, products);
      return {
        text: `${searchResults.searchIntent}\n\nI found ${searchResults.results.length} products that match your criteria. Here are my top recommendations:`,
        relatedProducts: searchResults.results.slice(0, 3)
      };
    }

    if (lowerText.includes('compare') || lowerText.includes('vs') || lowerText.includes('difference')) {
      // Product comparison query
      const relevantProducts = products.filter(p => 
        lowerText.split(' ').some(word => 
          p.name.toLowerCase().includes(word) || 
          p.category.toLowerCase().includes(word) ||
          p.tags.some(tag => tag.toLowerCase().includes(word))
        )
      ).slice(0, 3);

      if (relevantProducts.length > 1) {
        return {
          text: `Great question! Here's a comparison of the products that match your query. Each has unique strengths:\n\n${relevantProducts.map((p, i) => 
            `${i + 1}. **${p.name}** (₹${p.price.toLocaleString('en-IN')})\n   - Category: ${p.category}\n   - Key features: ${p.tags.slice(0, 2).join(', ')}`
          ).join('\n\n')}\n\nWould you like detailed analysis of any specific product?`,
          relatedProducts: relevantProducts
        };
      }
    }

    if (lowerText.includes('recommend') || lowerText.includes('suggest') || lowerText.includes('what should')) {
      // Recommendation query
      const userPreferences = {
        categories: extractCategories(lowerText),
        priceRange: extractPriceRange(lowerText),
        browsedProducts: [],
        previousPurchases: []
      };

      const recommendations = await geminiAI.getPersonalizedRecommendations(userPreferences, products);
      
      return {
        text: `Based on your preferences, here are my personalized recommendations:\n\n${recommendations.explanations.map((explanation, i) => 
          `${i + 1}. ${explanation}`
        ).join('\n\n')}\n\nConfidence: ${(recommendations.confidence * 100).toFixed(0)}%`,
        relatedProducts: recommendations.products
      };
    }

    if (lowerText.includes('trending') || lowerText.includes('popular') || lowerText.includes('best selling')) {
      // Trending products query
      const trendingProducts = products
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      return {
        text: `Here are the trending products right now! These are popular choices among shoppers:\n\n${trendingProducts.map((p, i) => 
          `${i + 1}. **${p.name}** - ${p.category}\n   Price: ₹${p.price.toLocaleString('en-IN')}\n   Why it's trending: ${p.tags.slice(0, 2).join(' and ')}`
        ).join('\n\n')}`,
        relatedProducts: trendingProducts
      };
    }

    if (lowerText.includes('budget') || lowerText.includes('cheap') || lowerText.includes('affordable')) {
      // Budget-friendly options
      const budgetProducts = products
        .sort((a, b) => a.price - b.price)
        .slice(0, 3);

      return {
        text: `Here are some excellent budget-friendly options that offer great value for money:\n\n${budgetProducts.map((p, i) => 
          `${i + 1}. **${p.name}** - ₹${p.price.toLocaleString('en-IN')}\n   Category: ${p.category}\n   Value proposition: ${p.tags.slice(0, 2).join(' and ')}`
        ).join('\n\n')}\n\nThese products offer the best bang for your buck!`,
        relatedProducts: budgetProducts
      };
    }

    // Generic helpful response using Gemini AI
    try {
      const questionResponse = await geminiAI.answerProductQuestion(
        userText,
        products[0], // Use first product as context
        `Available product categories: ${[...new Set(products.map(p => p.category))].join(', ')}`
      );

      return { text: questionResponse.text };
    } catch (error) {
      return {
        text: "I'd be happy to help you with your shopping questions! You can ask me to:\n\n• Find specific products\n• Compare different options\n• Get personalized recommendations\n• Check what's trending\n• Find budget-friendly alternatives\n\nWhat would you like to explore today?"
      };
    }
  };

  const extractCategories = (text: string): string[] => {
    const categories = ['electronics', 'laptop', 'phone', 'headphones', 'fitness', 'watch', 'camera', 'speaker', 'accessories'];
    return categories.filter(cat => text.toLowerCase().includes(cat));
  };

  const extractPriceRange = (text: string): {min: number, max: number} | undefined => {
    const priceMatch = text.match(/under\s*₹?(\d+)/i) || text.match(/below\s*₹?(\d+)/i);
    if (priceMatch) {
      return { min: 0, max: parseInt(priceMatch[1]) };
    }

    const rangeMatch = text.match(/₹?(\d+)\s*to\s*₹?(\d+)/i) || text.match(/between\s*₹?(\d+)\s*and\s*₹?(\d+)/i);
    if (rangeMatch) {
      return { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) };
    }

    return undefined;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-96 bg-white shadow-2xl border-2 border-purple-200 z-50 transition-all duration-300 ${
      isMinimized ? 'h-16' : 'h-[600px]'
    }`}>
      {/* Header */}
      <CardHeader className="pb-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Shopping Assistant
            <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by Gemini
            </Badge>
          </CardTitle>
          
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 hover:bg-white/20"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className="flex items-start gap-2">
                      {message.sender === 'ai' && <Bot className="h-4 w-4 mt-1 flex-shrink-0" />}
                      {message.sender === 'user' && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Related Products */}
                    {message.relatedProducts && message.relatedProducts.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium">Related Products:</p>
                        {message.relatedProducts.map((product) => (
                          <div key={product.id} className="bg-white/10 rounded p-2">
                            <p className="text-xs font-medium">{product.name}</p>
                            <p className="text-xs">₹{product.price.toLocaleString('en-IN')} • {product.category}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <div className="p-4 border-t bg-gray-50">
              <p className="text-xs font-medium text-gray-600 mb-2">Quick suggestions:</p>
              <div className="flex flex-wrap gap-1">
                {quickSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickSuggestion(suggestion)}
                    className="text-xs h-7 bg-white hover:bg-purple-50 hover:border-purple-300"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about products..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isLoading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};