import { UserProfile } from './personalizationService';

// Price Prediction Types
export interface PricePrediction {
  productId: string;
  currentPrice: number;
  predictedPrice: number;
  priceDirection: 'up' | 'down' | 'stable';
  confidence: number;
  bestBuyTime: string;
  priceHistory: PricePoint[];
  seasonalTrends: SeasonalTrend[];
}

export interface PricePoint {
  date: string;
  price: number;
  source: string;
}

export interface SeasonalTrend {
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'holiday' | 'backtoschool';
  averageDiscount: number;
  bestDealMonths: string[];
}

// Budget Planning Types
export interface BudgetPlan {
  id: string;
  name: string;
  totalBudget: number;
  spentAmount: number;
  remainingAmount: number;
  categories: BudgetCategory[];
  alerts: BudgetAlert[];
  createdAt: string;
  endDate: string;
}

export interface BudgetCategory {
  name: string;
  allocatedAmount: number;
  spentAmount: number;
  percentage: number;
  priority: 'high' | 'medium' | 'low';
}

export interface BudgetAlert {
  type: 'overspend' | 'nearLimit' | 'goodDeal' | 'budgetGoal';
  message: string;
  severity: 'info' | 'warning' | 'error';
  category?: string;
  timestamp: string;
}

// Stock Alerts Types
export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  alertType: 'back_in_stock' | 'low_stock' | 'price_drop' | 'deal_alert';
  threshold?: number;
  isActive: boolean;
  createdAt: string;
  triggeredAt?: string;
}

// Smart Comparison Types
export interface ComparisonResult {
  products: ProductComparison[];
  winner: string;
  reasoning: string;
  factors: ComparisonFactor[];
  recommendations: string[];
}

export interface ProductComparison {
  productId: string;
  name: string;
  price: number;
  rating: number;
  features: string[];
  pros: string[];
  cons: string[];
  score: number;
  valueRating: number;
}

export interface ComparisonFactor {
  name: string;
  weight: number;
  importance: 'critical' | 'important' | 'moderate' | 'minor';
}

// Smart Shopping Insight Types
export interface ShoppingInsight {
  type: 'price_trend' | 'deal_opportunity' | 'budget_tip' | 'seasonal_advice' | 'alternative_product';
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  savingsAmount?: number;
  confidence: number;
}

export class IntelligentAssistanceService {
  private priceHistory: Map<string, PricePoint[]> = new Map();
  private userBudgets: Map<string, BudgetPlan[]> = new Map();
  private stockAlerts: Map<string, StockAlert[]> = new Map();
  private comparisonCache: Map<string, ComparisonResult> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  // Price Prediction Methods
  async predictPrice(productId: string, days: number = 30): Promise<PricePrediction> {
    const priceHistory = this.priceHistory.get(productId) || [];
    const currentPrice = priceHistory[priceHistory.length - 1]?.price || 0;
    
    // Simulate price prediction algorithm
    const trend = this.calculatePriceTrend(priceHistory);
    const seasonalFactor = this.getSeasonalFactor(productId);
    const marketVolatility = this.calculateVolatility(priceHistory);
    
    const predictedChange = (trend * 0.6 + seasonalFactor * 0.3 + Math.random() * 0.1 - 0.05) * marketVolatility;
    const predictedPrice = Math.max(0, currentPrice * (1 + predictedChange));
    
    const priceDirection = predictedPrice > currentPrice ? 'up' : 
                          predictedPrice < currentPrice ? 'down' : 'stable';
    
    const confidence = Math.max(0.6, 1 - Math.abs(predictedChange) * 2);
    
    return {
      productId,
      currentPrice,
      predictedPrice: Math.round(predictedPrice * 100) / 100,
      priceDirection,
      confidence: Math.round(confidence * 100) / 100,
      bestBuyTime: this.calculateBestBuyTime(priceHistory, predictedPrice, currentPrice),
      priceHistory: priceHistory.slice(-30),
      seasonalTrends: this.getSeasonalTrends(productId)
    };
  }

  async getPriceAlerts(userId: string): Promise<ShoppingInsight[]> {
    const insights: ShoppingInsight[] = [];
    
    // Simulate price drop alerts
    const watchedProducts = ['product1', 'product2', 'product3'];
    
    for (const productId of watchedProducts) {
      const prediction = await this.predictPrice(productId);
      
      if (prediction.priceDirection === 'down' && prediction.confidence > 0.7) {
        insights.push({
          type: 'price_trend',
          title: 'Price Drop Expected',
          description: `${productId} is expected to drop by ${Math.round((prediction.currentPrice - prediction.predictedPrice) * 100) / 100}%`,
          action: `Wait ${prediction.bestBuyTime} for better price`,
          priority: 'high',
          savingsAmount: prediction.currentPrice - prediction.predictedPrice,
          confidence: prediction.confidence
        });
      }
    }
    
    return insights;
  }

  // Budget Planning Methods
  async createBudgetPlan(userId: string, planData: Partial<BudgetPlan>): Promise<BudgetPlan> {
    const plan: BudgetPlan = {
      id: `budget_${Date.now()}`,
      name: planData.name || 'My Budget Plan',
      totalBudget: planData.totalBudget || 1000,
      spentAmount: 0,
      remainingAmount: planData.totalBudget || 1000,
      categories: planData.categories || this.getDefaultCategories(),
      alerts: [],
      createdAt: new Date().toISOString(),
      endDate: planData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    const userBudgets = this.userBudgets.get(userId) || [];
    userBudgets.push(plan);
    this.userBudgets.set(userId, userBudgets);

    return plan;
  }

  async updateBudgetSpending(userId: string, budgetId: string, category: string, amount: number): Promise<BudgetPlan | null> {
    const userBudgets = this.userBudgets.get(userId) || [];
    const budget = userBudgets.find(b => b.id === budgetId);
    
    if (!budget) return null;

    // Update category spending
    const categoryBudget = budget.categories.find(c => c.name === category);
    if (categoryBudget) {
      categoryBudget.spentAmount += amount;
    }

    // Update total spending
    budget.spentAmount += amount;
    budget.remainingAmount = budget.totalBudget - budget.spentAmount;

    // Generate alerts
    this.generateBudgetAlerts(budget);

    return budget;
  }

  async getBudgetInsights(userId: string, budgetId: string): Promise<ShoppingInsight[]> {
    const userBudgets = this.userBudgets.get(userId) || [];
    const budget = userBudgets.find(b => b.id === budgetId);
    
    if (!budget) return [];

    const insights: ShoppingInsight[] = [];

    // Budget utilization insights
    const utilizationRate = budget.spentAmount / budget.totalBudget;
    
    if (utilizationRate > 0.8) {
      insights.push({
        type: 'budget_tip',
        title: 'Budget Alert',
        description: `You've used ${Math.round(utilizationRate * 100)}% of your budget`,
        action: 'Consider reducing spending or adjusting budget',
        priority: 'high',
        confidence: 1.0
      });
    }

    // Category-specific insights
    budget.categories.forEach(category => {
      const categoryUtilization = category.spentAmount / category.allocatedAmount;
      
      if (categoryUtilization > 1.0) {
        insights.push({
          type: 'budget_tip',
          title: `${category.name} Over Budget`,
          description: `Overspent by ₹${Math.round((category.spentAmount - category.allocatedAmount) * 100) / 100}`,
          action: `Reduce ${category.name} spending or reallocate budget`,
          priority: 'medium',
          confidence: 1.0
        });
      }
    });

    return insights;
  }

  // Stock Alert Methods
  async createStockAlert(userId: string, alertData: Partial<StockAlert>): Promise<StockAlert> {
    const alert: StockAlert = {
      id: `alert_${Date.now()}`,
      productId: alertData.productId || '',
      productName: alertData.productName || 'Unknown Product',
      alertType: alertData.alertType || 'back_in_stock',
      threshold: alertData.threshold,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const userAlerts = this.stockAlerts.get(userId) || [];
    userAlerts.push(alert);
    this.stockAlerts.set(userId, userAlerts);

    return alert;
  }

  async checkStockAlerts(userId: string): Promise<StockAlert[]> {
    const userAlerts = this.stockAlerts.get(userId) || [];
    const triggeredAlerts: StockAlert[] = [];

    for (const alert of userAlerts) {
      if (!alert.isActive) continue;

      const shouldTrigger = await this.shouldTriggerAlert(alert);
      
      if (shouldTrigger) {
        alert.triggeredAt = new Date().toISOString();
        triggeredAlerts.push(alert);
      }
    }

    return triggeredAlerts;
  }

  // Smart Comparison Methods
  async compareProducts(productIds: string[], userProfile?: UserProfile): Promise<ComparisonResult> {
    const cacheKey = productIds.sort().join('_');
    
    if (this.comparisonCache.has(cacheKey)) {
      return this.comparisonCache.get(cacheKey)!;
    }

    const products: ProductComparison[] = productIds.map(id => this.generateProductComparison(id, userProfile));
    
    // Calculate scores based on user preferences
    const factors = this.getComparisonFactors(userProfile);
    
    products.forEach(product => {
      product.score = this.calculateProductScore(product, factors);
    });

    // Sort by score
    products.sort((a, b) => b.score - a.score);
    
    const result: ComparisonResult = {
      products,
      winner: products[0]?.productId || '',
      reasoning: this.generateComparisonReasoning(products, factors),
      factors,
      recommendations: this.generateRecommendations(products, userProfile)
    };

    this.comparisonCache.set(cacheKey, result);
    return result;
  }

  async getSmartRecommendations(userId: string, userProfile?: UserProfile): Promise<ShoppingInsight[]> {
    const insights: ShoppingInsight[] = [];

    // Price-based recommendations
    const priceInsights = await this.getPriceAlerts(userId);
    insights.push(...priceInsights);

    // Budget-based recommendations
    const budgets = this.userBudgets.get(userId) || [];
    for (const budget of budgets) {
      const budgetInsights = await this.getBudgetInsights(userId, budget.id);
      insights.push(...budgetInsights);
    }

    // Seasonal recommendations
    const seasonalInsights = this.getSeasonalRecommendations(userProfile);
    insights.push(...seasonalInsights);

    // Alternative product suggestions
    const alternativeInsights = this.getAlternativeProductInsights(userProfile);
    insights.push(...alternativeInsights);

    return insights.sort((a, b) => 
      (b.priority === 'high' ? 2 : b.priority === 'medium' ? 1 : 0) -
      (a.priority === 'high' ? 2 : a.priority === 'medium' ? 1 : 0)
    );
  }

  // Private Helper Methods
  private initializeSampleData(): void {
    // Initialize sample price history
    const sampleProducts = ['product1', 'product2', 'product3'];
    
    sampleProducts.forEach(productId => {
      const history: PricePoint[] = [];
      let basePrice = 50 + Math.random() * 200;
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const variation = (Math.random() - 0.5) * 0.1;
        basePrice = Math.max(10, basePrice * (1 + variation));
        
        history.push({
          date: date.toISOString(),
          price: Math.round(basePrice * 100) / 100,
          source: 'marketplace'
        });
      }
      
      this.priceHistory.set(productId, history);
    });
  }

  private calculatePriceTrend(priceHistory: PricePoint[]): number {
    if (priceHistory.length < 2) return 0;
    
    const recent = priceHistory.slice(-7);
    const older = priceHistory.slice(-14, -7);
    
    const recentAvg = recent.reduce((sum, p) => sum + p.price, 0) / recent.length;
    const olderAvg = older.reduce((sum, p) => sum + p.price, 0) / older.length;
    
    return (recentAvg - olderAvg) / olderAvg;
  }

  private getSeasonalFactor(productId: string): number {
    const month = new Date().getMonth();
    const seasonalFactors = [
      -0.1, -0.05, 0.05, 0.1, 0.05, 0, // Jan-Jun
      -0.05, -0.1, 0.05, 0.1, 0.15, 0.2 // Jul-Dec
    ];
    
    return seasonalFactors[month] || 0;
  }

  private calculateVolatility(priceHistory: PricePoint[]): number {
    if (priceHistory.length < 2) return 1;
    
    const changes = [];
    for (let i = 1; i < priceHistory.length; i++) {
      const change = (priceHistory[i].price - priceHistory[i-1].price) / priceHistory[i-1].price;
      changes.push(Math.abs(change));
    }
    
    const avgVolatility = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    return Math.max(0.5, Math.min(2.0, 1 + avgVolatility * 5));
  }

  private calculateBestBuyTime(priceHistory: PricePoint[], predictedPrice: number, currentPrice: number): string {
    if (predictedPrice < currentPrice) {
      const daysToDrop = Math.ceil(Math.random() * 14) + 1;
      return `in ${daysToDrop} days`;
    }
    return 'now';
  }

  private getSeasonalTrends(productId: string): SeasonalTrend[] {
    return [
      {
        season: 'winter',
        averageDiscount: 15,
        bestDealMonths: ['January', 'February']
      },
      {
        season: 'spring',
        averageDiscount: 10,
        bestDealMonths: ['March', 'April']
      },
      {
        season: 'summer',
        averageDiscount: 5,
        bestDealMonths: ['July', 'August']
      },
      {
        season: 'fall',
        averageDiscount: 20,
        bestDealMonths: ['November', 'December']
      },
      {
        season: 'holiday',
        averageDiscount: 25,
        bestDealMonths: ['November', 'December']
      }
    ];
  }

  private getDefaultCategories(): BudgetCategory[] {
    return [
      { name: 'Electronics', allocatedAmount: 300, spentAmount: 0, percentage: 30, priority: 'high' },
      { name: 'Clothing', allocatedAmount: 200, spentAmount: 0, percentage: 20, priority: 'medium' },
      { name: 'Home & Garden', allocatedAmount: 200, spentAmount: 0, percentage: 20, priority: 'medium' },
      { name: 'Books & Media', allocatedAmount: 100, spentAmount: 0, percentage: 10, priority: 'low' },
      { name: 'Sports & Outdoors', allocatedAmount: 150, spentAmount: 0, percentage: 15, priority: 'medium' },
      { name: 'Other', allocatedAmount: 50, spentAmount: 0, percentage: 5, priority: 'low' }
    ];
  }

  private generateBudgetAlerts(budget: BudgetPlan): void {
    budget.alerts = [];
    
    // Overall budget alerts
    const overallUtilization = budget.spentAmount / budget.totalBudget;
    
    if (overallUtilization >= 1.0) {
      budget.alerts.push({
        type: 'overspend',
        message: 'Budget exceeded!',
        severity: 'error',
        timestamp: new Date().toISOString()
      });
    } else if (overallUtilization >= 0.8) {
      budget.alerts.push({
        type: 'nearLimit',
        message: '80% of budget used',
        severity: 'warning',
        timestamp: new Date().toISOString()
      });
    }

    // Category-specific alerts
    budget.categories.forEach(category => {
      const categoryUtilization = category.spentAmount / category.allocatedAmount;
      
      if (categoryUtilization >= 1.0) {
        budget.alerts.push({
          type: 'overspend',
          message: `${category.name} budget exceeded`,
          severity: 'error',
          category: category.name,
          timestamp: new Date().toISOString()
        });
      } else if (categoryUtilization >= 0.9) {
        budget.alerts.push({
          type: 'nearLimit',
          message: `${category.name} budget 90% used`,
          severity: 'warning',
          category: category.name,
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  private async shouldTriggerAlert(alert: StockAlert): Promise<boolean> {
    // Simulate stock checking logic
    const randomFactor = Math.random();
    
    switch (alert.alertType) {
      case 'back_in_stock':
        return randomFactor > 0.8; // 20% chance of being back in stock
      case 'low_stock':
        return randomFactor > 0.7; // 30% chance of low stock
      case 'price_drop':
        return randomFactor > 0.85; // 15% chance of price drop
      case 'deal_alert':
        return randomFactor > 0.9; // 10% chance of deal
      default:
        return false;
    }
  }

  private generateProductComparison(productId: string, userProfile?: UserProfile): ProductComparison {
    const baseFeatures = ['Feature A', 'Feature B', 'Feature C'];
    const randomFeatures = baseFeatures.slice(0, Math.floor(Math.random() * 3) + 1);
    
    return {
      productId,
      name: `Product ${productId}`,
      price: 50 + Math.random() * 200,
      rating: 3 + Math.random() * 2,
      features: randomFeatures,
      pros: ['Pro 1', 'Pro 2'],
      cons: ['Con 1'],
      score: 0, // Will be calculated
      valueRating: 3 + Math.random() * 2
    };
  }

  private getComparisonFactors(userProfile?: UserProfile): ComparisonFactor[] {
    const baseFactors = [
      { name: 'Price', weight: 0.3, importance: 'critical' as const },
      { name: 'Quality', weight: 0.25, importance: 'critical' as const },
      { name: 'Features', weight: 0.2, importance: 'important' as const },
      { name: 'Brand', weight: 0.15, importance: 'moderate' as const },
      { name: 'Reviews', weight: 0.1, importance: 'moderate' as const }
    ];

    // Adjust weights based on user profile
    if (userProfile?.preferences?.budget === 'budget') {
      baseFactors[0].weight = 0.4; // Increase price importance
    } else if (userProfile?.preferences?.budget === 'premium') {
      baseFactors[1].weight = 0.35; // Increase quality importance
    }

    return baseFactors;
  }

  private calculateProductScore(product: ProductComparison, factors: ComparisonFactor[]): number {
    let score = 0;
    
    // Normalize price (lower is better)
    const priceScore = Math.max(0, (300 - product.price) / 300);
    score += priceScore * factors.find(f => f.name === 'Price')!.weight;
    
    // Quality score (rating normalized)
    const qualityScore = product.rating / 5;
    score += qualityScore * factors.find(f => f.name === 'Quality')!.weight;
    
    // Features score
    const featuresScore = product.features.length / 3;
    score += featuresScore * factors.find(f => f.name === 'Features')!.weight;
    
    // Brand score (random for demo)
    const brandScore = Math.random();
    score += brandScore * factors.find(f => f.name === 'Brand')!.weight;
    
    // Reviews score
    const reviewsScore = product.rating / 5;
    score += reviewsScore * factors.find(f => f.name === 'Reviews')!.weight;
    
    return Math.round(score * 100) / 100;
  }

  private generateComparisonReasoning(products: ProductComparison[], factors: ComparisonFactor[]): string {
    if (products.length === 0) return 'No products to compare';
    
    const winner = products[0];
    const topFactor = factors[0];
    
    return `${winner.name} wins primarily due to its superior ${topFactor.name.toLowerCase()}, scoring ${winner.score} overall.`;
  }

  private generateRecommendations(products: ProductComparison[], userProfile?: UserProfile): string[] {
    const recommendations = [];
    
    if (products.length > 1) {
      const priceDiff = Math.abs(products[0].price - products[1].price);
      if (priceDiff > 50) {
        recommendations.push(`Consider if the ₹${priceDiff} price difference is worth the additional features`);
      }
    }
    
    recommendations.push('Check for current promotions and discounts');
    recommendations.push('Read recent customer reviews for updated feedback');
    
    if (userProfile?.preferences?.budget === 'budget') {
      recommendations.push('Look for refurbished or open-box alternatives');
    }
    
    return recommendations;
  }

  private getSeasonalRecommendations(userProfile?: UserProfile): ShoppingInsight[] {
    const month = new Date().getMonth();
    const insights: ShoppingInsight[] = [];
    
    if (month >= 10 || month <= 1) { // Nov-Feb (Holiday/Winter)
      insights.push({
        type: 'seasonal_advice',
        title: 'Holiday Shopping Season',
        description: 'Major discounts available on electronics and clothing',
        action: 'Check for Black Friday and Cyber Monday deals',
        priority: 'high',
        confidence: 0.9
      });
    } else if (month >= 6 && month <= 8) { // Jul-Sep (Back to School)
      insights.push({
        type: 'seasonal_advice',
        title: 'Back-to-School Season',
        description: 'Great deals on laptops, supplies, and clothing',
        action: 'Shop for educational discounts and student deals',
        priority: 'medium',
        confidence: 0.8
      });
    }
    
    return insights;
  }

  private getAlternativeProductInsights(userProfile?: UserProfile): ShoppingInsight[] {
    const insights: ShoppingInsight[] = [];
    
    // Generic alternative suggestions
    insights.push({
      type: 'alternative_product',
      title: 'Consider Generic Brands',
      description: 'Generic alternatives can save 20-40% with similar quality',
      action: 'Compare store brands and lesser-known manufacturers',
      priority: 'medium',
      savingsAmount: 25,
      confidence: 0.7
    });
    
    if (userProfile?.preferences?.sustainability === 'high') {
      insights.push({
        type: 'alternative_product',
        title: 'Eco-Friendly Alternatives',
        description: 'Sustainable options available with minimal price premium',
        action: 'Filter for eco-certified and sustainable products',
        priority: 'medium',
        confidence: 0.8
      });
    }
    
    return insights;
  }
}

export const intelligentAssistanceService = new IntelligentAssistanceService();