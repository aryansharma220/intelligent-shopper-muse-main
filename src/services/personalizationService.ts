import { Product } from '../data/products';
import { geminiAI } from './geminiAI';

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
  createdAt: Date;
  lastActive: Date;
  
  // Personal Information
  demographics: {
    age?: number;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    location?: string;
    occupation?: string;
    income_range?: 'under_25k' | '25k_50k' | '50k_100k' | '100k_plus';
  };
  
  // Shopping Preferences
  preferences: {
    categories: string[];
    brands: string[];
    priceRange: { min: number; max: number };
    style: string[];
    priorities: ('price' | 'quality' | 'brand' | 'reviews' | 'features')[];
    shoppingFrequency: 'daily' | 'weekly' | 'monthly' | 'occasional';
    preferredDelivery: 'fast' | 'standard' | 'eco_friendly';
    budget?: 'budget' | 'moderate' | 'premium';
    sustainability?: 'low' | 'medium' | 'high';
  };
  
  // Behavioral Data
  behavior: {
    browsingPatterns: {
      timeOfDay: string[];
      daysOfWeek: string[];
      sessionDuration: number;
      pagesPerSession: number;
    };
    purchaseHistory: {
      totalSpent: number;
      averageOrderValue: number;
      mostPurchasedCategory: string;
      seasonalTrends: Record<string, string[]>;
    };
    searchPatterns: {
      commonKeywords: string[];
      searchToClickRatio: number;
      refinementPatterns: string[];
    };
  };
  
  // AI Learning Data
  aiProfile: {
    personalityType: 'explorer' | 'researcher' | 'bargain_hunter' | 'brand_loyal' | 'trendsetter';
    confidenceScore: number;
    learningStage: 'new' | 'learning' | 'established' | 'expert';
    preferences_accuracy: number;
    last_model_update: Date;
  };
  
  // Context & Mood
  context: {
    currentMood?: 'shopping' | 'browsing' | 'comparing' | 'urgent' | 'casual';
    currentNeed?: 'gift' | 'personal' | 'work' | 'home' | 'special_occasion';
    budget_context?: 'tight' | 'normal' | 'flexible' | 'unlimited';
    timeContext?: 'immediate' | 'planned' | 'future';
  };
  
  // Seasonal & Event Preferences
  seasonal: {
    festivalPreferences: string[];
    seasonalItems: Record<string, string[]>;
    giftGivingHabits: {
      occasions: string[];
      typical_budget: number;
      preferred_categories: string[];
    };
  };
}

export interface ShoppingMood {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  categories: string[];
  priceModifier: number;
  urgency: 'low' | 'medium' | 'high';
}

export const SHOPPING_MOODS: ShoppingMood[] = [
  {
    id: 'cozy_weekend',
    name: 'Cozy Weekend',
    description: 'Looking for comfort items for a relaxing weekend',
    keywords: ['comfort', 'relaxing', 'cozy', 'weekend', 'home'],
    categories: ['Home & Kitchen', 'Fashion', 'Books & Stationery'],
    priceModifier: 0.8,
    urgency: 'low'
  },
  {
    id: 'work_mode',
    name: 'Work Essentials',
    description: 'Professional items to enhance productivity',
    keywords: ['professional', 'work', 'office', 'productivity', 'business'],
    categories: ['Electronics', 'Books & Stationery', 'Fashion'],
    priceModifier: 1.2,
    urgency: 'medium'
  },
  {
    id: 'fitness_motivated',
    name: 'Fitness Journey',
    description: 'Ready to invest in health and fitness',
    keywords: ['fitness', 'health', 'workout', 'active', 'strong'],
    categories: ['Sports & Fitness', 'Personal Care'],
    priceModifier: 1.1,
    urgency: 'medium'
  },
  {
    id: 'festive_celebration',
    name: 'Festival Ready',
    description: 'Preparing for festivals and celebrations',
    keywords: ['festival', 'celebration', 'traditional', 'festive', 'special'],
    categories: ['Fashion', 'Home & Kitchen', 'Accessories'],
    priceModifier: 1.3,
    urgency: 'high'
  },
  {
    id: 'gift_hunting',
    name: 'Perfect Gift',
    description: 'Finding the ideal gift for someone special',
    keywords: ['gift', 'present', 'surprise', 'special', 'thoughtful'],
    categories: ['Electronics', 'Fashion', 'Accessories', 'Books & Stationery'],
    priceModifier: 1.15,
    urgency: 'high'
  },
  {
    id: 'bargain_hunting',
    name: 'Smart Savings',
    description: 'Looking for the best deals and value',
    keywords: ['deal', 'bargain', 'save', 'budget', 'value'],
    categories: [], // All categories
    priceModifier: 0.6,
    urgency: 'low'
  }
];

export class PersonalizationService {
  private userProfile: UserProfile | null = null;
  private sessionData: any = {};

  constructor() {
    this.loadUserProfile();
    this.startSessionTracking();
  }

  private loadUserProfile() {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      this.userProfile = JSON.parse(saved);
      this.updateLastActive();
    } else {
      this.createNewProfile();
    }
  }

  private saveUserProfile() {
    if (this.userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
    }
  }

  private createNewProfile() {
    this.userProfile = {
      id: this.generateProfileId(),
      createdAt: new Date(),
      lastActive: new Date(),
      
      demographics: {},
      
      preferences: {
        categories: [],
        brands: [],
        priceRange: { min: 0, max: 100000 },
        style: [],
        priorities: ['quality', 'price'],
        shoppingFrequency: 'monthly',
        preferredDelivery: 'standard'
      },
      
      behavior: {
        browsingPatterns: {
          timeOfDay: [],
          daysOfWeek: [],
          sessionDuration: 0,
          pagesPerSession: 0
        },
        purchaseHistory: {
          totalSpent: 0,
          averageOrderValue: 0,
          mostPurchasedCategory: '',
          seasonalTrends: {}
        },
        searchPatterns: {
          commonKeywords: [],
          searchToClickRatio: 0,
          refinementPatterns: []
        }
      },
      
      aiProfile: {
        personalityType: 'explorer',
        confidenceScore: 0.1,
        learningStage: 'new',
        preferences_accuracy: 0,
        last_model_update: new Date()
      },
      
      context: {},
      
      seasonal: {
        festivalPreferences: [],
        seasonalItems: {},
        giftGivingHabits: {
          occasions: [],
          typical_budget: 5000,
          preferred_categories: []
        }
      }
    };
    
    this.saveUserProfile();
  }

  private generateProfileId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2);
  }

  private updateLastActive() {
    if (this.userProfile) {
      this.userProfile.lastActive = new Date();
      this.saveUserProfile();
    }
  }

  private startSessionTracking() {
    this.sessionData = {
      startTime: new Date(),
      pageViews: 0,
      interactions: 0,
      searchQueries: []
    };
  }

  // Public Methods
  public getUserProfile(): UserProfile | null {
    return this.userProfile;
  }

  public updateProfile(updates: Partial<UserProfile>) {
    if (this.userProfile) {
      this.userProfile = { ...this.userProfile, ...updates };
      this.updateLastActive();
      this.saveUserProfile();
    }
  }

  public trackInteraction(type: string, data: any) {
    if (!this.userProfile) return;

    this.sessionData.interactions++;
    
    switch (type) {
      case 'product_view':
        this.trackProductView(data);
        break;
      case 'search':
        this.trackSearch(data);
        break;
      case 'category_browse':
        this.trackCategoryBrowse(data);
        break;
      case 'purchase':
        this.trackPurchase(data);
        break;
    }
    
    this.updateLastActive();
  }

  private trackProductView(product: Product) {
    if (!this.userProfile) return;

    // Update category preferences
    const categories = this.userProfile.preferences.categories;
    if (!categories.includes(product.category)) {
      categories.push(product.category);
      if (categories.length > 10) categories.splice(0, 1); // Keep last 10
    }

    // Update price range based on viewed products
    const currentRange = this.userProfile.preferences.priceRange;
    if (product.price > currentRange.min && product.price < currentRange.max * 1.5) {
      // Gradually adjust price range based on viewing patterns
      currentRange.max = Math.max(currentRange.max, product.price * 1.2);
    }

    this.saveUserProfile();
  }

  private trackSearch(query: string) {
    if (!this.userProfile) return;

    this.userProfile.behavior.searchPatterns.commonKeywords.push(query.toLowerCase());
    this.sessionData.searchQueries.push(query);
    
    // Keep only recent searches
    if (this.userProfile.behavior.searchPatterns.commonKeywords.length > 50) {
      this.userProfile.behavior.searchPatterns.commonKeywords.splice(0, 1);
    }

    this.saveUserProfile();
  }

  private trackCategoryBrowse(category: string) {
    if (!this.userProfile) return;

    const categories = this.userProfile.preferences.categories;
    const index = categories.indexOf(category);
    
    if (index > -1) {
      // Move to front (recently browsed)
      categories.splice(index, 1);
      categories.unshift(category);
    } else {
      categories.unshift(category);
      if (categories.length > 10) categories.pop();
    }

    this.saveUserProfile();
  }

  private trackPurchase(data: { product: Product; amount: number }) {
    if (!this.userProfile) return;

    const history = this.userProfile.behavior.purchaseHistory;
    history.totalSpent += data.amount;
    history.averageOrderValue = history.totalSpent / (history.averageOrderValue + 1);
    
    // Update most purchased category
    const categoryCount: Record<string, number> = {};
    // This would need to track actual purchase history
    history.mostPurchasedCategory = data.product.category;

    this.saveUserProfile();
  }

  public async getPersonalizedRecommendations(
    products: Product[],
    mood?: ShoppingMood
  ): Promise<{
    products: Product[];
    explanations: string[];
    confidence: number;
  }> {
    if (!this.userProfile) {
      return { products: products.slice(0, 3), explanations: ['Getting to know your preferences'], confidence: 0.1 };
    }

    const preferences = this.buildAIPreferences(mood);
    
    try {
      return await geminiAI.getPersonalizedRecommendations(preferences, products);
    } catch (error) {
      console.error('AI recommendations failed, using local personalization:', error);
      return this.getLocalPersonalizedRecommendations(products, mood);
    }
  }

  private buildAIPreferences(mood?: ShoppingMood) {
    if (!this.userProfile) return {};

    const basePref = {
      categories: this.userProfile.preferences.categories,
      priceRange: this.userProfile.preferences.priceRange,
      browsedProducts: [], // Would come from session data
      previousPurchases: [] // Would come from purchase history
    };

    if (mood) {
      // Adjust preferences based on mood
      const adjustedRange = {
        min: basePref.priceRange.min * mood.priceModifier,
        max: basePref.priceRange.max * mood.priceModifier
      };

      return {
        ...basePref,
        priceRange: adjustedRange,
        categories: mood.categories.length > 0 ? mood.categories : basePref.categories,
        mood: mood.name,
        urgency: mood.urgency
      };
    }

    return basePref;
  }

  private getLocalPersonalizedRecommendations(
    products: Product[],
    mood?: ShoppingMood
  ): { products: Product[]; explanations: string[]; confidence: number } {
    if (!this.userProfile) {
      return { products: products.slice(0, 3), explanations: ['Random selection'], confidence: 0.1 };
    }

    let filteredProducts = [...products];
    const preferences = this.userProfile.preferences;

    // Filter by preferred categories
    if (preferences.categories.length > 0) {
      const categoryFilter = mood?.categories.length ? mood.categories : preferences.categories;
      filteredProducts = filteredProducts.filter(p => 
        categoryFilter.includes(p.category)
      );
    }

    // Filter by price range (with mood adjustment)
    let priceRange = preferences.priceRange;
    if (mood) {
      priceRange = {
        min: priceRange.min * mood.priceModifier,
        max: priceRange.max * mood.priceModifier
      };
    }

    filteredProducts = filteredProducts.filter(p => 
      p.price >= priceRange.min && p.price <= priceRange.max
    );

    // Sort by relevance score
    const scoredProducts = filteredProducts.map(product => ({
      product,
      score: this.calculateRelevanceScore(product, mood)
    }));

    scoredProducts.sort((a, b) => b.score - a.score);
    
    const topProducts = scoredProducts.slice(0, 3).map(sp => sp.product);
    const explanations = topProducts.map(product => 
      this.generateExplanation(product, mood)
    );

    return {
      products: topProducts,
      explanations,
      confidence: this.userProfile.aiProfile.confidenceScore
    };
  }

  private calculateRelevanceScore(product: Product, mood?: ShoppingMood): number {
    if (!this.userProfile) return Math.random();

    let score = 0;

    // Category preference score
    const categoryIndex = this.userProfile.preferences.categories.indexOf(product.category);
    if (categoryIndex > -1) {
      score += (10 - categoryIndex) * 0.2; // More recent = higher score
    }

    // Price preference score
    const priceRange = this.userProfile.preferences.priceRange;
    const midPrice = (priceRange.min + priceRange.max) / 2;
    const priceDiff = Math.abs(product.price - midPrice) / midPrice;
    score += Math.max(0, 1 - priceDiff) * 0.3;

    // Mood alignment score
    if (mood) {
      const moodKeywords = mood.keywords;
      const productText = (product.name + ' ' + product.description + ' ' + product.tags.join(' ')).toLowerCase();
      const moodMatches = moodKeywords.filter(keyword => 
        productText.includes(keyword.toLowerCase())
      ).length;
      score += (moodMatches / moodKeywords.length) * 0.3;
    }

    // Add randomness for diversity
    score += Math.random() * 0.2;

    return score;
  }

  private generateExplanation(product: Product, mood?: ShoppingMood): string {
    const explanations = [
      `Perfect match for your ${product.category.toLowerCase()} preferences`,
      `Great value at ₹${product.price.toLocaleString('en-IN')} within your budget`,
      `Highly rated product that aligns with your shopping patterns`,
      `Trending choice among users with similar preferences`
    ];

    if (mood) {
      explanations.unshift(`Ideal for your ${mood.name.toLowerCase()} mood`);
    }

    return explanations[Math.floor(Math.random() * explanations.length)];
  }

  public setShoppingMood(moodId: string) {
    const mood = SHOPPING_MOODS.find(m => m.id === moodId);
    if (mood && this.userProfile) {
      this.userProfile.context.currentMood = mood.name as any;
      this.saveUserProfile();
    }
    return mood;
  }

  public getShoppingMoods(): ShoppingMood[] {
    return SHOPPING_MOODS;
  }

  public getCurrentMood(): ShoppingMood | null {
    if (!this.userProfile?.context.currentMood) return null;
    return SHOPPING_MOODS.find(m => m.name === this.userProfile?.context.currentMood) || null;
  }

  public updatePersonalityType(): void {
    if (!this.userProfile) return;

    const behavior = this.userProfile.behavior;
    const preferences = this.userProfile.preferences;

    // Simple personality detection based on behavior
    if (preferences.priorities.includes('price') && behavior.purchaseHistory.averageOrderValue < 5000) {
      this.userProfile.aiProfile.personalityType = 'bargain_hunter';
    } else if (preferences.categories.length > 5) {
      this.userProfile.aiProfile.personalityType = 'explorer';
    } else if (behavior.searchPatterns.commonKeywords.length > 20) {
      this.userProfile.aiProfile.personalityType = 'researcher';
    } else if (preferences.brands.length > 3) {
      this.userProfile.aiProfile.personalityType = 'brand_loyal';
    } else {
      this.userProfile.aiProfile.personalityType = 'trendsetter';
    }

    // Update confidence score
    this.userProfile.aiProfile.confidenceScore = Math.min(1.0, 
      (behavior.browsingPatterns.sessionDuration + preferences.categories.length * 0.1) / 10
    );

    this.saveUserProfile();
  }

  public getSeasonalRecommendations(): string[] {
    const now = new Date();
    const month = now.getMonth();

    // Indian seasonal recommendations
    if (month >= 9 && month <= 11) { // Oct-Dec: Festival season
      return ['Traditional wear', 'Home decor', 'Gifts', 'Electronics deals'];
    } else if (month >= 2 && month <= 5) { // Mar-Jun: Summer
      return ['Cooling appliances', 'Summer clothing', 'Travel accessories', 'Health products'];
    } else if (month >= 6 && month <= 8) { // Jul-Sep: Monsoon
      return ['Monsoon gear', 'Indoor entertainment', 'Comfort food', 'Home essentials'];
    } else { // Dec-Feb: Winter
      return ['Winter clothing', 'Warm accessories', 'Health supplements', 'Comfort items'];
    }
  }
}

// Export singleton instance
export const personalizationService = new PersonalizationService();
export default personalizationService;