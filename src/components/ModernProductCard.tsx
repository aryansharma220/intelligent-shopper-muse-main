import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Star, 
  Eye, 
  Heart, 
  ShoppingCart, 
  Sparkles, 
  TrendingUp, 
  Brain,
  ChevronDown,
  ChevronUp,
  Zap,
  Award,
  Clock,
  Shield,
  Truck
} from 'lucide-react';
import { Product, getPlaceholderImage } from '@/data/products';
import { geminiAI } from '@/services/geminiAI';

interface ProductCardProps {
  product: Product;
  onView?: (product: Product) => void;
  onLike?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

interface AIAnalysis {
  pros: string[];
  cons: string[];
  aiInsight: string;
  recommendedFor: string[];
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  onLike,
  onAddToCart,
  variant = 'default',
  className = ''
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [aiAnalysis, setAIAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Generate consistent rating and review count based on product ID
  const { rating, reviewCount, discount, popularityScore } = useMemo(() => {
    const seed = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const randomRating = 3.5 + (seed % 1000) / 1000 * 1.5; // 3.5-5.0
    const randomReviews = 10 + (seed % 490); // 10-500
    const hasDiscount = product.price > 5000 && (seed % 3) === 0;
    const discountPercent = hasDiscount ? 10 + (seed % 30) : 0; // 10-40% discount
    const popularity = 60 + (seed % 40); // 60-100% popularity

    return {
      rating: Number(randomRating.toFixed(1)),
      reviewCount: randomReviews,
      discount: discountPercent,
      popularityScore: popularity
    };
  }, [product.id]);

  const originalPrice = discount > 0 ? Math.round(product.price / (1 - discount / 100)) : product.price;
  const savings = originalPrice - product.price;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike?.(product);
  };

  const handleView = () => {
    onView?.(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const toggleAIAnalysis = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showAIAnalysis && !aiAnalysis) {
      setIsLoadingAnalysis(true);
      try {
        const analysis = await geminiAI.analyzeProduct(product);
        setAIAnalysis(analysis);
      } catch (error) {
        console.error('Failed to get AI analysis:', error);
      } finally {
        setIsLoadingAnalysis(false);
      }
    }
    setShowAIAnalysis(!showAIAnalysis);
  };

  const getTrendIcon = () => {
    if (popularityScore > 85) return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (rating >= 4.5) return <Award className="h-3 w-3 text-yellow-500" />;
    if (discount > 0) return <Zap className="h-3 w-3 text-orange-500" />;
    return <Clock className="h-3 w-3 text-blue-500" />;
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          card: 'h-auto max-w-sm',
          image: 'aspect-[3/2]',
          content: 'p-3',
          footer: 'p-3 pt-0'
        };
      case 'detailed':
        return {
          card: 'h-auto max-w-md',
          image: 'aspect-[4/3]',
          content: 'p-4',
          footer: 'p-4 pt-0'
        };
      default:
        return {
          card: 'h-auto max-w-sm',
          image: 'aspect-[4/3]',
          content: 'p-4',
          footer: 'p-4 pt-0'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Card 
      className={`group ${styles.card} relative overflow-hidden cursor-pointer transition-all duration-500 
        hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-400/10
        border border-gray-200/60 dark:border-gray-700/60
        bg-gradient-to-br from-white via-gray-50/30 to-white 
        dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900
        hover:scale-[1.02] hover:border-purple-300 dark:hover:border-purple-600
        backdrop-blur-sm transform-gpu
        ${className}`}
      onClick={handleView}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Indicators */}
      <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
        {discount > 0 && (
          <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-1 shadow-lg animate-pulse">
            -{discount}% OFF
          </Badge>
        )}
        {popularityScore > 90 && (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 shadow-lg">
            <TrendingUp className="h-3 w-3 mr-1" />
            Trending
          </Badge>
        )}
        {rating >= 4.8 && (
          <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs px-2 py-1 shadow-lg">
            <Award className="h-3 w-3 mr-1" />
            Top Rated
          </Badge>
        )}
      </div>

      {/* Category & Actions */}
      <div className="absolute top-2 right-2 z-20 flex flex-col gap-2">
        <Badge 
          variant="secondary" 
          className="bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-lg text-xs font-semibold 
            border border-gray-200/50 dark:border-gray-600/50 px-3 py-1"
        >
          {product.category}
        </Badge>
        
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="secondary"
            className={`h-8 w-8 backdrop-blur-md transition-all duration-300 shadow-lg 
              ${isLiked 
                ? 'bg-red-500 text-white hover:bg-red-600 scale-110' 
                : 'bg-white/95 hover:bg-white dark:bg-black/95 dark:hover:bg-black hover:scale-110'
              } border border-gray-200/50 dark:border-gray-600/50`}
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 transition-all duration-300 ${
              isLiked ? 'fill-current' : ''
            }`} />
          </Button>
          
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/95 hover:bg-white dark:bg-black/95 dark:hover:bg-black 
              backdrop-blur-md shadow-lg border border-gray-200/50 dark:border-gray-600/50
              hover:scale-110 transition-all duration-300"
            onClick={toggleAIAnalysis}
          >
            <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </Button>
        </div>
      </div>

      <CardHeader className="p-0 relative">
        <div className={`relative overflow-hidden ${styles.image} bg-gray-100 dark:bg-gray-800`}>
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse" />
          )}
          
          <img 
            src={getPlaceholderImage(product.category, product.name)} 
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          {/* Dynamic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent 
            opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Quick Actions */}
          <div className={`absolute bottom-3 left-3 right-3 transform transition-all duration-500 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}>
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
                  text-white shadow-xl backdrop-blur-sm border-0 h-9"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button 
                variant="secondary"
                className="bg-white/95 hover:bg-white dark:bg-black/95 dark:hover:bg-black 
                  backdrop-blur-sm shadow-xl border-0 h-9 px-3"
                onClick={handleView}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className={`absolute bottom-3 left-3 flex gap-2 transition-all duration-500 ${
            isHovered ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
          }`}>
            <div className="flex gap-1">
              <Badge variant="secondary" className="bg-white/90 dark:bg-black/90 text-xs px-2 py-1 backdrop-blur-sm">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
              <Badge variant="secondary" className="bg-white/90 dark:bg-black/90 text-xs px-2 py-1 backdrop-blur-sm">
                <Truck className="h-3 w-3 mr-1" />
                Fast Ship
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={`${styles.content} space-y-3`}>
        {/* Rating & Reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3.5 w-3.5 transition-colors ${
                    i < Math.floor(rating) 
                      ? 'text-yellow-400 fill-current' 
                      : i < rating 
                        ? 'text-yellow-400 fill-current opacity-50'
                        : 'text-gray-300 dark:text-gray-600'
                  }`} 
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {rating}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({reviewCount.toLocaleString()})
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className="text-xs text-gray-500 dark:text-gray-400">{popularityScore}%</span>
          </div>
        </div>

        {/* Product Title */}
        <div className="space-y-1">
          <h3 className="font-bold text-base leading-tight text-gray-900 dark:text-gray-100 
            group-hover:text-purple-600 dark:group-hover:text-purple-400 
            transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
          
          {variant === 'detailed' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {product.tags.slice(0, variant === 'compact' ? 1 : 3).map((tag, index) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="text-xs px-2 py-0.5 bg-purple-50/80 dark:bg-purple-900/20 
                border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 
                hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors cursor-default"
            >
              {tag}
            </Badge>
          ))}
          {product.tags.length > (variant === 'compact' ? 1 : 3) && (
            <Badge variant="outline" className="text-xs px-2 py-0.5 cursor-default">
              +{product.tags.length - (variant === 'compact' ? 1 : 3)}
            </Badge>
          )}
        </div>

        {/* AI Analysis Expansion */}
        {showAIAnalysis && (
          <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            {isLoadingAnalysis ? (
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
              </div>
            ) : aiAnalysis ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">AI Analysis</span>
                </div>
                
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                  {aiAnalysis.aiInsight}
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-medium text-green-600 dark:text-green-400">Pros:</span>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 ml-1">
                      {aiAnalysis.pros.slice(0, 2).map((pro, idx) => (
                        <li key={idx} className="truncate">{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium text-red-600 dark:text-red-400">Cons:</span>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 ml-1">
                      {aiAnalysis.cons.slice(0, 2).map((con, idx) => (
                        <li key={idx} className="truncate">{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">Failed to load AI analysis</p>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className={`${styles.footer} flex flex-col gap-3`}>
        {/* Price Section */}
        <div className="w-full flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 
                bg-clip-text text-transparent">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {discount > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            
            {savings > 0 && (
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Save ₹{savings.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              size="sm"
              className="border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 
                hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-600
                transition-all duration-300 h-8 px-3"
              onClick={handleView}
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {variant === 'detailed' && (
          <div className="w-full grid grid-cols-3 gap-2 text-center text-xs border-t border-gray-200 dark:border-gray-700 pt-2">
            <div className="space-y-1">
              <div className="text-gray-500 dark:text-gray-400">Rating</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{rating}/5</div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-500 dark:text-gray-400">Reviews</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{reviewCount}</div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-500 dark:text-gray-400">Popular</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{popularityScore}%</div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;