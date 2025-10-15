import { geminiAI } from './geminiAI';
import { Product } from '../data/products';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'product' | 'recommendation' | 'comparison';
  metadata?: {
    products?: Product[];
    suggestions?: string[];
    confidence?: number;
    actionType?: string;
  };
}

export interface UserContext {
  name?: string;
  preferences: {
    categories: string[];
    priceRange: { min: number; max: number };
    style: string[];
    language: 'en' | 'hi' | 'ta' | 'bn';
  };
  shoppingHistory: {
    viewed: string[];
    liked: string[];
    purchased: string[];
    searches: string[];
  };
  currentSession: {
    intent: string;
    context: string[];
    lastActivity: Date;
  };
}

export class AdvancedChatbotService {
  private conversationHistory: ChatMessage[] = [];
  private userContext: UserContext | null = null;
  private activeSession: string | null = null;

  constructor() {
    this.loadUserContext();
  }

  private loadUserContext() {
    const saved = localStorage.getItem('userContext');
    if (saved) {
      this.userContext = JSON.parse(saved);
    } else {
      this.initializeUserContext();
    }
  }

  private saveUserContext() {
    if (this.userContext) {
      localStorage.setItem('userContext', JSON.stringify(this.userContext));
    }
  }

  private initializeUserContext() {
    this.userContext = {
      preferences: {
        categories: [],
        priceRange: { min: 0, max: 100000 },
        style: [],
        language: 'en'
      },
      shoppingHistory: {
        viewed: [],
        liked: [],
        purchased: [],
        searches: []
      },
      currentSession: {
        intent: '',
        context: [],
        lastActivity: new Date()
      }
    };
    this.saveUserContext();
  }

  public updateUserContext(updates: Partial<UserContext>) {
    if (this.userContext) {
      this.userContext = { ...this.userContext, ...updates };
      this.saveUserContext();
    }
  }

  public addToHistory(interaction: { type: 'viewed' | 'liked' | 'purchased' | 'searched', value: string }) {
    if (!this.userContext) return;

    const { type, value } = interaction;
    const history = this.userContext.shoppingHistory;

    switch (type) {
      case 'viewed':
        if (!history.viewed.includes(value)) {
          history.viewed.unshift(value);
          history.viewed = history.viewed.slice(0, 50); // Keep last 50
        }
        break;
      case 'liked':
        if (!history.liked.includes(value)) {
          history.liked.unshift(value);
        }
        break;
      case 'purchased':
        if (!history.purchased.includes(value)) {
          history.purchased.unshift(value);
        }
        break;
      case 'searched':
        if (!history.searches.includes(value)) {
          history.searches.unshift(value);
          history.searches = history.searches.slice(0, 20); // Keep last 20
        }
        break;
    }

    this.saveUserContext();
  }

  private analyzeUserIntent(message: string): {
    intent: string;
    entities: string[];
    confidence: number;
  } {
    const lowerMessage = message.toLowerCase();
    
    // Shopping intents
    if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('looking for')) {
      return { intent: 'product_search', entities: this.extractEntities(message), confidence: 0.9 };
    }
    
    if (lowerMessage.includes('compare') || lowerMessage.includes('vs') || lowerMessage.includes('difference')) {
      return { intent: 'product_comparison', entities: this.extractEntities(message), confidence: 0.85 };
    }
    
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
      return { intent: 'recommendation', entities: this.extractEntities(message), confidence: 0.8 };
    }
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
      return { intent: 'budget_shopping', entities: this.extractEntities(message), confidence: 0.85 };
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('expensive')) {
      return { intent: 'price_inquiry', entities: this.extractEntities(message), confidence: 0.8 };
    }

    // Personal assistance intents
    if (lowerMessage.includes('help') || lowerMessage.includes('how to') || lowerMessage.includes('guide')) {
      return { intent: 'help_request', entities: this.extractEntities(message), confidence: 0.9 };
    }

    if (lowerMessage.includes('trending') || lowerMessage.includes('popular') || lowerMessage.includes('best selling')) {
      return { intent: 'trending_inquiry', entities: this.extractEntities(message), confidence: 0.85 };
    }

    return { intent: 'general_chat', entities: [], confidence: 0.6 };
  }

  private extractEntities(message: string): string[] {
    const entities: string[] = [];
    const lowerMessage = message.toLowerCase();

    // Categories
    const categories = ['electronics', 'fashion', 'home', 'kitchen', 'sports', 'fitness', 'books', 'accessories', 'personal care', 'grocery', 'baby', 'kids'];
    categories.forEach(cat => {
      if (lowerMessage.includes(cat)) entities.push(`category:${cat}`);
    });

    // Products
    const products = ['laptop', 'phone', 'headphones', 'shoes', 'shirt', 'watch', 'bag', 'camera'];
    products.forEach(prod => {
      if (lowerMessage.includes(prod)) entities.push(`product:${prod}`);
    });

    // Price ranges
    const priceMatch = lowerMessage.match(/(\d+)/g);
    if (priceMatch) {
      entities.push(`price:${priceMatch[0]}`);
    }

    return entities;
  }

  private getContextualResponse(intent: string, entities: string[], message: string): string {
    const context = this.userContext;
    if (!context) return "I'd be happy to help you with your shopping needs!";

    const recentSearches = context.shoppingHistory.searches.slice(0, 3);
    const preferences = context.preferences;

    switch (intent) {
      case 'product_search':
        if (recentSearches.length > 0) {
          return `I see you've been looking for ${recentSearches[0]} recently. Let me help you find what you're looking for now!`;
        }
        break;

      case 'recommendation':
        if (preferences.categories.length > 0) {
          return `Based on your interest in ${preferences.categories.join(', ')}, I can suggest some great products!`;
        }
        break;

      case 'budget_shopping':
        return `I understand you're looking for value! Your typical budget range seems to be ₹${preferences.priceRange.min}-₹${preferences.priceRange.max}. Let me find great deals in that range.`;

      case 'trending_inquiry':
        return `Great question! Based on your preferences and current trends, here's what's popular...`;

      default:
        return "I'm here to help you find the perfect products for your needs!";
    }

    return "How can I assist you with your shopping today?";
  }

  public async processMessage(
    message: string,
    products: Product[]
  ): Promise<ChatMessage> {
    // Analyze user intent
    const analysis = this.analyzeUserIntent(message);
    
    // Update user context with search
    this.addToHistory({ type: 'searched', value: message });

    // Update session context
    if (this.userContext) {
      this.userContext.currentSession.intent = analysis.intent;
      this.userContext.currentSession.context.push(message);
      this.userContext.currentSession.lastActivity = new Date();
      this.saveUserContext();
    }

    try {
      // Get AI response with context
      const contextualPrompt = this.buildContextualPrompt(message, analysis);
      let aiResponse: string;
      let responseMetadata: any = {};

      switch (analysis.intent) {
        case 'product_search':
          const searchResults = await geminiAI.generateSmartSearchResults(message, products);
          aiResponse = `${searchResults.searchIntent}\n\nI found ${searchResults.results.length} products that match your criteria. Here are my top recommendations:`;
          responseMetadata = {
            products: searchResults.results.slice(0, 3),
            suggestions: searchResults.suggestions,
            actionType: 'search'
          };
          break;

        case 'recommendation':
          const userPreferences = this.getUserPreferencesForAI();
          const recommendations = await geminiAI.getPersonalizedRecommendations(userPreferences, products);
          aiResponse = `Based on your preferences and shopping history, here are my personalized recommendations:\n\n${recommendations.explanations.join('\n\n')}`;
          responseMetadata = {
            products: recommendations.products,
            confidence: recommendations.confidence,
            actionType: 'recommend'
          };
          break;

        case 'product_comparison':
          const relevantProducts = this.findRelevantProducts(message, products);
          if (relevantProducts.length >= 2) {
            aiResponse = await this.generateComparison(relevantProducts.slice(0, 3));
            responseMetadata = {
              products: relevantProducts.slice(0, 3),
              actionType: 'compare'
            };
          } else {
            aiResponse = "I'd be happy to help you compare products! Please specify which products you'd like to compare, or I can suggest similar products to compare.";
          }
          break;

        case 'budget_shopping':
          const budgetProducts = this.findBudgetProducts(message, products);
          aiResponse = `Here are some excellent budget-friendly options that offer great value:\n\n${budgetProducts.map((p, i) => `${i + 1}. ${p.name} - ₹${p.price.toLocaleString('en-IN')}`).join('\n')}`;
          responseMetadata = {
            products: budgetProducts,
            actionType: 'budget'
          };
          break;

        case 'trending_inquiry':
          const trendingProducts = products.sort(() => Math.random() - 0.5).slice(0, 3);
          aiResponse = `Here's what's trending right now based on user activity and seasonal patterns:\n\n${trendingProducts.map((p, i) => `${i + 1}. ${p.name} - Popular in ${p.category}`).join('\n')}`;
          responseMetadata = {
            products: trendingProducts,
            actionType: 'trending'
          };
          break;

        default:
          const questionResponse = await geminiAI.answerProductQuestion(message, products[0], this.getContextString());
          aiResponse = questionResponse.text;
      }

      // Create response message
      const responseMessage: ChatMessage = {
        id: Date.now().toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        type: responseMetadata.products ? 'product' : 'text',
        metadata: responseMetadata
      };

      this.conversationHistory.push(responseMessage);
      return responseMessage;

    } catch (error) {
      console.error('Error processing message:', error);
      
      // Fallback response
      const fallbackMessage: ChatMessage = {
        id: Date.now().toString(),
        text: this.getContextualResponse(analysis.intent, analysis.entities, message),
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };

      return fallbackMessage;
    }
  }

  private buildContextualPrompt(message: string, analysis: any): string {
    const context = this.userContext;
    if (!context) return message;

    return `
User Context:
- Preferred categories: ${context.preferences.categories.join(', ') || 'None yet'}
- Budget range: ₹${context.preferences.priceRange.min}-₹${context.preferences.priceRange.max}
- Recent searches: ${context.shoppingHistory.searches.slice(0, 3).join(', ') || 'None'}
- Shopping intent: ${analysis.intent}

User message: ${message}

Please provide a helpful, personalized response that takes into account the user's context and shopping history.
`;
  }

  private getUserPreferencesForAI() {
    const context = this.userContext;
    if (!context) return {};

    return {
      categories: context.preferences.categories,
      priceRange: context.preferences.priceRange,
      browsedProducts: context.shoppingHistory.viewed,
      previousPurchases: context.shoppingHistory.purchased
    };
  }

  private findRelevantProducts(message: string, products: Product[]): Product[] {
    const lowerMessage = message.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(lowerMessage.split(' ').find(word => 
        p.name.toLowerCase().includes(word) || 
        p.category.toLowerCase().includes(word) ||
        p.tags.some(tag => tag.toLowerCase().includes(word))
      ) || '')
    ).slice(0, 5);
  }

  private findBudgetProducts(message: string, products: Product[]): Product[] {
    const priceMatch = message.match(/(\d+)/);
    const maxPrice = priceMatch ? parseInt(priceMatch[0]) : (this.userContext?.preferences.priceRange.max || 10000);
    
    return products
      .filter(p => p.price <= maxPrice)
      .sort((a, b) => a.price - b.price)
      .slice(0, 5);
  }

  private async generateComparison(products: Product[]): Promise<string> {
    const comparisonPrompt = `Compare these products and provide key differences:
${products.map((p, i) => `${i + 1}. ${p.name} - ₹${p.price} (${p.category})`).join('\n')}

Provide a brief comparison highlighting main differences in features, price, and suitability.`;

    try {
      const comparisonResponse = await geminiAI.answerProductQuestion(comparisonPrompt, products[0]);
      return comparisonResponse.text;
    } catch (error) {
      return `Here's a quick comparison:\n${products.map((p, i) => 
        `${i + 1}. **${p.name}** - ₹${p.price.toLocaleString('en-IN')}\n   Category: ${p.category}\n   Features: ${p.tags.slice(0, 2).join(', ')}`
      ).join('\n\n')}`;
    }
  }

  private getContextString(): string {
    const context = this.userContext;
    if (!context) return '';

    return `User has shown interest in: ${context.preferences.categories.join(', ')}. Recent searches: ${context.shoppingHistory.searches.slice(0, 3).join(', ')}`;
  }

  public getConversationHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  public clearHistory() {
    this.conversationHistory = [];
  }

  public getUserContext(): UserContext | null {
    return this.userContext;
  }

  // Quick response templates for common queries
  public getQuickResponses(): string[] {
    const context = this.userContext;
    if (!context) return [
      "What's trending in electronics?",
      "Find budget smartphones",
      "Recommend fitness products",
      "Compare laptop options",
      "Show me deals under ₹5000"
    ];

    const responses = [
      "What's new in my favorite categories?",
      "Find products similar to my recent purchases",
      "Show me deals in my budget range",
      "What's trending this week?",
      "Help me find a gift"
    ];

    // Add category-specific quick responses
    if (context.preferences.categories.length > 0) {
      responses.push(`Find new ${context.preferences.categories[0]} products`);
    }

    return responses;
  }
}

// Export singleton instance
export const advancedChatbot = new AdvancedChatbotService();
export default advancedChatbot;