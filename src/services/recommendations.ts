import { products, getUserInteractions, Product } from '@/data/products';
import { geminiAI } from './geminiAI';

export interface RecommendationRequest {
  sessionId: string;
  limit?: number;
}

export interface RecommendationResponse {
  product: Product;
  explanation: string;
  score: number;
  confidence: number;
}

// Enhanced AI-powered recommendation engine
export class RecommendationEngine {
  
  static async generateRecommendations(sessionId: string, limit: number = 3): Promise<RecommendationResponse[]> {
    const userInteractions = getUserInteractions(sessionId);
    
    // Get user's interaction history
    const viewedProductIds = userInteractions
      .filter(interaction => interaction.interaction_type === 'view')
      .map(interaction => interaction.product_id);
    
    const likedProductIds = userInteractions
      .filter(interaction => interaction.interaction_type === 'like')
      .map(interaction => interaction.product_id);

    // Get categories user has shown interest in
    const viewedProducts = products.filter(p => viewedProductIds.includes(p.id));
    const likedProducts = products.filter(p => likedProductIds.includes(p.id));
    
    const preferredCategories = [
      ...new Set([
        ...viewedProducts.map(p => p.category),
        ...likedProducts.map(p => p.category)
      ])
    ];

    // Get price range user seems to prefer
    const viewedPrices = viewedProducts.map(p => p.price);
    const avgPrice = viewedPrices.length > 0 
      ? viewedPrices.reduce((sum, price) => sum + price, 0) / viewedPrices.length 
      : 15000; // Default mid-range

    // Prepare user preferences for AI
    const userPreferences = {
      categories: preferredCategories,
      priceRange: {
        min: Math.max(0, avgPrice * 0.5),
        max: avgPrice * 1.5
      },
      previousPurchases: likedProductIds,
      browsedProducts: viewedProductIds
    };

    // Get AI-powered recommendations
    try {
      const aiRecommendations = await geminiAI.getPersonalizedRecommendations(
        userPreferences,
        products
      );

      // Convert to RecommendationResponse format
      const responses: RecommendationResponse[] = aiRecommendations.products.map((product, index) => ({
        product,
        explanation: aiRecommendations.explanations[index] || 'Recommended based on your preferences',
        score: 95 - (index * 5), // Decreasing score for ranking
        confidence: aiRecommendations.confidence
      }));

      // If we don't have enough AI recommendations, supplement with local ones
      if (responses.length < limit) {
        const localRecommendations = this.generateLocalRecommendations(sessionId, limit - responses.length);
        responses.push(...localRecommendations);
      }

      return responses.slice(0, limit);
    } catch (error) {
      console.error('AI recommendations failed, falling back to local:', error);
      return this.generateLocalRecommendations(sessionId, limit);
    }
  }

  static generateLocalRecommendations(sessionId: string, limit: number = 3): RecommendationResponse[] {
    const userInteractions = getUserInteractions(sessionId);
    
    // Get user's interaction history
    const viewedProductIds = userInteractions
      .filter(interaction => interaction.interaction_type === 'view')
      .map(interaction => interaction.product_id);
    
    const likedProductIds = userInteractions
      .filter(interaction => interaction.interaction_type === 'like')
      .map(interaction => interaction.product_id);

    // Get categories user has shown interest in
    const viewedProducts = products.filter(p => viewedProductIds.includes(p.id));
    const likedProducts = products.filter(p => likedProductIds.includes(p.id));
    
    const preferredCategories = [
      ...new Set([
        ...viewedProducts.map(p => p.category),
        ...likedProducts.map(p => p.category)
      ])
    ];

    // Get price range user seems to prefer
    const viewedPrices = viewedProducts.map(p => p.price);
    const avgPrice = viewedPrices.length > 0 
      ? viewedPrices.reduce((sum, price) => sum + price, 0) / viewedPrices.length 
      : 15000; // Default mid-range

    // Filter products for recommendations
    const candidateProducts = products.filter(product => {
      // Don't recommend already viewed/liked products
      if (viewedProductIds.includes(product.id) || likedProductIds.includes(product.id)) {
        return false;
      }

      // Prefer products in categories user has shown interest in
      const categoryMatch = preferredCategories.length === 0 || preferredCategories.includes(product.category);
      
      // Consider price preference (within 50% of user's average)
      const priceMatch = product.price >= avgPrice * 0.5 && product.price <= avgPrice * 1.5;
      
      return categoryMatch || priceMatch;
    });

    // If no candidates based on preferences, use all products except viewed/liked
    const finalCandidates = candidateProducts.length >= limit 
      ? candidateProducts 
      : products.filter(p => !viewedProductIds.includes(p.id) && !likedProductIds.includes(p.id));

    // Score and rank products
    const scoredProducts = finalCandidates.map(product => {
      let score = 50; // Base score
      let confidence = 60; // Base confidence

      // Boost score for preferred categories
      if (preferredCategories.includes(product.category)) {
        score += 20;
        confidence += 15;
      }

      // Boost score for similar price range
      const priceDiff = Math.abs(product.price - avgPrice) / avgPrice;
      if (priceDiff < 0.3) {
        score += 15;
        confidence += 10;
      }

      // Boost score for popular tags
      const popularTags = ['premium', 'wireless', 'smart', 'fitness', 'healthy'];
      const hasPopularTags = product.tags.some(tag => popularTags.includes(tag));
      if (hasPopularTags) {
        score += 10;
        confidence += 8;
      }

      // Add some randomness for diversity
      score += Math.random() * 15;
      confidence += Math.random() * 12;

      // Ensure scores are within bounds
      score = Math.min(100, Math.max(50, score));
      confidence = Math.min(100, Math.max(60, confidence));

      return {
        product,
        score: Math.round(score),
        confidence: Math.round(confidence)
      };
    });

    // Sort by score and take top recommendations
    const topRecommendations = scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Generate explanations
    return topRecommendations.map((rec, index) => {
      const explanations = [
        `Based on your interest in ${preferredCategories.length > 0 ? preferredCategories[0] : 'quality products'}, this ${rec.product.name} is an excellent choice. It offers great value at ₹${rec.product.price.toLocaleString('en-IN')} and has features that align with your preferences.`,
        
        `This ${rec.product.name} caught our AI's attention because it matches your browsing patterns. With a price of ₹${rec.product.price.toLocaleString('en-IN')}, it's positioned well within your preferred range and offers the quality you're looking for.`,
        
        `Our recommendation engine selected this ${rec.product.name} specifically for you. It's in the ${rec.product.category} category and priced at ₹${rec.product.price.toLocaleString('en-IN')}, making it a smart choice based on your shopping behavior.`,
        
        `Perfect match! This ${rec.product.name} aligns with your preferences for ${rec.product.category.toLowerCase()} products. At ₹${rec.product.price.toLocaleString('en-IN')}, it offers excellent features: ${rec.product.tags.slice(0, 2).join(', ')}.`,
        
        `Highly recommended based on your activity! This ${rec.product.name} combines quality and value at ₹${rec.product.price.toLocaleString('en-IN')}. It's popular among users with similar preferences in ${rec.product.category.toLowerCase()}.`
      ];

      return {
        ...rec,
        explanation: explanations[index % explanations.length]
      };
    });
  }
}

// Simulate API endpoint
export const getRecommendationsAPI = async (request: RecommendationRequest): Promise<RecommendationResponse[]> => {
  return RecommendationEngine.generateRecommendations(request.sessionId, request.limit || 3);
};