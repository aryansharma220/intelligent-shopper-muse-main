import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, TrendingUp, Brain, Star, ShoppingCart, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface RecommendationCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image_url: string;
  };
  explanation: string;
  confidence?: number;
  rank?: number;
  isLoading?: boolean;
}

export const RecommendationCard = ({ 
  product, 
  explanation, 
  confidence = 85, 
  rank = 1,
  isLoading 
}: RecommendationCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-purple-200 dark:border-purple-800 bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
        <CardHeader className="p-0">
          <Skeleton className="w-full aspect-video" />
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return "text-green-600 dark:text-green-400";
    if (conf >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getConfidenceLabel = (conf: number) => {
    if (conf >= 90) return "Perfect Match";
    if (conf >= 80) return "Great Match";
    if (conf >= 70) return "Good Match";
    return "Possible Match";
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { text: "🥇 Top Pick", color: "bg-gradient-to-r from-yellow-400 to-yellow-600" };
    if (rank === 2) return { text: "🥈 2nd Choice", color: "bg-gradient-to-r from-gray-400 to-gray-600" };
    if (rank === 3) return { text: "🥉 3rd Choice", color: "bg-gradient-to-r from-amber-600 to-amber-800" };
    return { text: `#${rank} Pick`, color: "bg-gradient-to-r from-purple-500 to-pink-500" };
  };

  const rankBadge = getRankBadge(rank);

  return (
    <Card className="overflow-hidden border-purple-200 dark:border-purple-800 bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 hover:shadow-2xl transition-all duration-500 transform hover:scale-102 relative group">
      {/* Rank badge */}
      <div className="absolute top-4 left-4 z-10">
        <Badge className={`${rankBadge.color} text-white border-0 shadow-lg`}>
          {rankBadge.text}
        </Badge>
      </div>

      <CardHeader className="p-0">
        <div className="relative">
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {/* Top right badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Recommended
            </Badge>
            <Badge variant="secondary" className="bg-white/90 dark:bg-black/90 backdrop-blur-sm shadow-lg">
              {product.category}
            </Badge>
          </div>

          {/* Bottom overlay info */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-lg p-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-sm font-semibold ${getConfidenceColor(confidence)}`}>
                    {getConfidenceLabel(confidence)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {confidence}% confidence
                  </div>
                </div>
                <div className="w-16">
                  <Progress 
                    value={confidence} 
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-xl text-foreground group-hover:text-purple-600 transition-colors duration-300 leading-tight">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {product.description}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${
                    i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`} 
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">4.5</span>
            </div>
          </div>
        </div>
        
        {/* AI Explanation */}
        <div className="border-t border-purple-200 dark:border-purple-800 pt-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-full flex-shrink-0">
              <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-purple-700 dark:text-purple-300 mb-1">
                Why we recommend this:
              </h4>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button 
            variant="outline"
            size="icon"
            className={`border-2 transition-all duration-300 ${
              isLiked 
                ? 'border-red-500 bg-red-500 text-white hover:bg-red-600' 
                : 'border-purple-200 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
            }`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`h-4 w-4 transition-all duration-300 ${
              isLiked ? 'fill-current' : ''
            }`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
