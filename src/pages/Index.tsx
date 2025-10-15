import { useState, useEffect } from "react";
import { products as localProducts, getAllCategories, searchProducts, getProductsByCategory, getProductsByPriceRange, addUserInteraction, generateSessionId, Product } from "@/data/products";
import { getRecommendationsAPI } from "@/services/recommendations";
import { RecommendationCard } from "@/components/RecommendationCard";
import { SmartSearch } from "@/components/SmartSearch";
import IntelligentAssistanceDashboard from "@/components/IntelligentAssistanceDashboard";
import { ResponsiveProductGrid } from "@/components/ResponsiveProductGrid";
import { ThemeToggle } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, ShoppingBag, TrendingUp, Search, Filter, Zap, Brain, Star, Bot, MessageCircle, Calculator, Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Recommendation {
  product: Product;
  explanation: string;
  score: number;
  confidence?: number;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [sessionId] = useState(() => generateSessionId());
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchIntent, setSearchIntent] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [showIntelligentAssistance, setShowIntelligentAssistance] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Update displayed products when filters change
    setDisplayedProducts(getFilteredProducts());
  }, [products, selectedCategory, searchQuery, sortBy, priceRange]);

  const fetchProducts = async () => {
    // Use local products instead of Supabase
    setProducts(localProducts);
    setDisplayedProducts(localProducts);
  };

  const handleInteraction = async (productId: string, type: 'view' | 'click' | 'like') => {
    // Use local storage instead of Supabase
    addUserInteraction(sessionId, productId, type);

    toast({
      title: type === 'like' ? "Added to favorites!" : "Interaction recorded",
      description: "We're learning your preferences",
    });
  };

  const getRecommendations = async () => {
    setIsLoadingRecommendations(true);
    
    try {
      // Use local recommendation service with AI enhancement
      const recommendations = await getRecommendationsAPI({ sessionId });
      setRecommendations(recommendations);
      
      toast({
        title: "AI Recommendations updated!",
        description: `Found ${recommendations.length} personalized recommendations using Gemini AI`,
      });
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        title: "Error getting recommendations",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleSearchResults = (results: Product[], intent?: string) => {
    setDisplayedProducts(results);
    setSearchIntent(intent || '');
    
    if (intent) {
      toast({
        title: "AI Search Complete",
        description: intent,
      });
    }
  };

  const categories = ["All", ...getAllCategories()];
  
  // Enhanced filtering logic
  const getFilteredProducts = () => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPrice = priceRange === "all" || 
        (priceRange === "under2000" && product.price < 2000) ||
        (priceRange === "2000to10000" && product.price >= 2000 && product.price <= 10000) ||
        (priceRange === "10000to25000" && product.price >= 10000 && product.price <= 25000) ||
        (priceRange === "over25000" && product.price > 25000);
      
      return matchesCategory && matchesSearch && matchesPrice;
    }).sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "name": return a.name.localeCompare(b.name);
        default: return 0; // newest (default order)
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                ShopMuse
              </span>
            </div>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              AI-Powered
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowIntelligentAssistance(true)}
              className="hidden md:inline-flex"
            >
              <Brain className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-50 via-cyan-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="flex justify-center mb-6">
              <Badge className="mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg animate-bounce">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Recommendations
              </Badge>
            </div>            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-cyan-900 dark:from-white dark:via-indigo-200 dark:to-cyan-200 bg-clip-text text-transparent leading-tight">
              Discover Products
              <span className="block text-5xl md:text-6xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                You'll Love
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experience the future of online shopping in India with our AI-powered recommendation engine. 
              Get personalized suggestions that understand your unique preferences and budget.
            </p>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-8">
              <div className="flex flex-col items-center p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Brain className="h-8 w-8 text-indigo-500 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Gemini AI Powered</h3>
                <p className="text-sm text-muted-foreground text-center">Google's latest Gemini 2.0 Flash for intelligent shopping assistance</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <MessageCircle className="h-8 w-8 text-purple-500 mb-3" />
                <h3 className="font-semibold text-lg mb-2">AI Chat Assistant</h3>
                <p className="text-sm text-muted-foreground text-center">Ask questions, get recommendations, and compare products with AI</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Calculator className="h-8 w-8 text-cyan-500 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Smart Tools</h3>
                <p className="text-sm text-muted-foreground text-center">Price prediction, budget planning, and intelligent comparison tools</p>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg"
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <ShoppingBag className="mr-3 h-6 w-6" />
                Browse Products
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg"
                onClick={getRecommendations}
                disabled={isLoadingRecommendations}
              >
                <TrendingUp className="mr-3 h-6 w-6" />
                {isLoadingRecommendations ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                    Analyzing...
                  </span>
                ) : (
                  'Get AI Recommendations'
                )}
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg"
                onClick={() => setShowIntelligentAssistance(true)}
              >
                <Calculator className="mr-3 h-6 w-6" />
                Smart Assistant
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Search and Filter Section */}
      <section className="container mx-auto px-4 py-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* AI-Powered Smart Search */}
            <div className="flex-1 max-w-2xl">
              <SmartSearch
                products={products}
                onSearchResults={handleSearchResults}
                placeholder="Ask AI: 'Find wireless headphones under ₹5000' or 'Best laptops for students'"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-3 flex-wrap items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Filters:</span>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under2000">Under ₹2,000</SelectItem>
                  <SelectItem value="2000to10000">₹2,000 - ₹10,000</SelectItem>
                  <SelectItem value="10000to25000">₹10,000 - ₹25,000</SelectItem>
                  <SelectItem value="over25000">Above ₹25,000</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Search Intent Display */}
          {searchIntent && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-800 font-medium">AI Understanding:</span>
                <span className="text-sm text-blue-700">{searchIntent}</span>
              </div>
            </div>
          )}
          
          {/* Results Info */}
          <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
            <span>Showing {displayedProducts.length} of {products.length} products</span>
            {searchQuery && (
              <span>Search results for "{searchQuery}"</span>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Recommendations Section */}
      {recommendations.length > 0 && (
        <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI Recommendations
                </h2>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our Gemini AI has analyzed your preferences and found these perfect matches from our Indian product collection
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map(({ product, explanation, confidence }, index) => (
                <div key={product.id} className="transform hover:scale-105 transition-all duration-300">
                  <RecommendationCard
                    product={product}
                    explanation={explanation}
                    confidence={confidence}
                    rank={index + 1}
                  />
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button 
                onClick={getRecommendations}
                disabled={isLoadingRecommendations}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {isLoadingRecommendations ? 'Refreshing...' : 'Refresh Recommendations'}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Products Section */}
      <section id="products" className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Product Collection</h2>
            <p className="text-lg text-muted-foreground">
              Explore our curated selection of products for the Indian market
            </p>
          </div>
          
          {displayedProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria, or ask our AI assistant for help
              </p>
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setPriceRange("all");
                    setDisplayedProducts(products);
                    setSearchIntent("");
                  }}
                >
                  Clear Filters
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={getRecommendations}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get AI Recommendations
                </Button>
              </div>
            </div>
          ) : (
            <ResponsiveProductGrid
              products={displayedProducts}
              onProductView={(p) => handleInteraction(p.id, 'view')}
              onProductLike={(p) => handleInteraction(p.id, 'like')}
              onAddToCart={(p) => handleInteraction(p.id, 'click')}
            />
          )}
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 via-pink-600/90 to-red-600/90"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-bold mb-6">
              Ready for Your Perfect Match?
            </h3>
            
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Let our AI discover products perfect for your lifestyle and budget. 
              Start browsing and see the magic of personalized Indian shopping!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg font-semibold"
                onClick={getRecommendations}
                disabled={isLoadingRecommendations}
              >
                <Brain className="mr-3 h-6 w-6" />
                {isLoadingRecommendations ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mr-2"></div>
                    Analyzing Your Preferences...
                  </span>
                ) : (
                  'Get AI Recommendations'
                )}
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg font-semibold"
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <ShoppingBag className="mr-3 h-6 w-6" />
                Continue Browsing
              </Button>
            </div>
            
            {recommendations.length > 0 && (
              <div className="mt-8 text-lg opacity-75">
                🎉 You already have {recommendations.length} personalized recommendations!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Intelligent Assistance Dashboard Modal */}
      {showIntelligentAssistance && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Intelligent Shopping Assistant</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowIntelligentAssistance(false)}
                className="h-8 w-8 p-0"
              >
                ✕
              </Button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <IntelligentAssistanceDashboard 
                userId={sessionId}
                userProfile={undefined} // Can be enhanced with actual user profile
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
