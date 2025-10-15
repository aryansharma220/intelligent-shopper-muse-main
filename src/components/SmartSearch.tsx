import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Sparkles, 
  Brain, 
  TrendingUp, 
  Clock, 
  X,
  Lightbulb
} from 'lucide-react';
import { Product } from '@/data/products';
import { geminiAI } from '@/services/geminiAI';

interface SmartSearchProps {
  products: Product[];
  onSearchResults: (results: Product[], searchIntent?: string) => void;
  placeholder?: string;
}

interface SearchSuggestion {
  text: string;
  type: 'recent' | 'trending' | 'ai';
  icon?: React.ReactNode;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
  products,
  onSearchResults,
  placeholder = "Search with AI - try 'wireless headphones under ₹5000'"
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [searchIntent, setSearchIntent] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Generate suggestions based on query
  useEffect(() => {
    if (query.length > 0) {
      generateSuggestions(query);
    } else {
      generateDefaultSuggestions();
    }
  }, [query]);

  const generateDefaultSuggestions = () => {
    const defaultSuggestions: SearchSuggestion[] = [
      ...recentSearches.map(search => ({
        text: search,
        type: 'recent' as const,
        icon: <Clock className="h-3 w-3" />
      })),
      {
        text: 'wireless bluetooth headphones',
        type: 'trending',
        icon: <TrendingUp className="h-3 w-3" />
      },
      {
        text: 'laptop under 50000',
        type: 'trending',
        icon: <TrendingUp className="h-3 w-3" />
      },
      {
        text: 'smart fitness tracker',
        type: 'ai',
        icon: <Sparkles className="h-3 w-3" />
      },
      {
        text: 'premium smartphone accessories',
        type: 'ai',
        icon: <Sparkles className="h-3 w-3" />
      }
    ];

    setSuggestions(defaultSuggestions.slice(0, 6));
  };

  const generateSuggestions = (searchQuery: string) => {
    const lowerQuery = searchQuery.toLowerCase();
    
    // AI-powered suggestions based on query context
    const contextSuggestions: SearchSuggestion[] = [];
    
    if (lowerQuery.includes('wireless') || lowerQuery.includes('bluetooth')) {
      contextSuggestions.push(
        { text: 'wireless bluetooth earbuds', type: 'ai', icon: <Sparkles className="h-3 w-3" /> },
        { text: 'wireless charging pad', type: 'ai', icon: <Sparkles className="h-3 w-3" /> }
      );
    }
    
    if (lowerQuery.includes('laptop') || lowerQuery.includes('computer')) {
      contextSuggestions.push(
        { text: 'laptop under 30000', type: 'ai', icon: <Sparkles className="h-3 w-3" /> },
        { text: 'laptop accessories bundle', type: 'ai', icon: <Sparkles className="h-3 w-3" /> }
      );
    }
    
    if (lowerQuery.includes('phone') || lowerQuery.includes('mobile')) {
      contextSuggestions.push(
        { text: 'smartphone under 20000', type: 'ai', icon: <Sparkles className="h-3 w-3" /> },
        { text: 'phone case and screen protector', type: 'ai', icon: <Sparkles className="h-3 w-3" /> }
      );
    }

    // Add product-based suggestions
    const matchingProducts = products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    ).slice(0, 3);

    const productSuggestions = matchingProducts.map(p => ({
      text: p.name,
      type: 'trending' as const,
      icon: <TrendingUp className="h-3 w-3" />
    }));

    setSuggestions([...contextSuggestions, ...productSuggestions].slice(0, 6));
  };

  const saveRecentSearch = (searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSuggestions(false);
    saveRecentSearch(searchQuery.trim());

    try {
      // Use AI-powered search
      const searchResults = await geminiAI.generateSmartSearchResults(searchQuery, products);
      
      setSearchIntent(searchResults.searchIntent);
      onSearchResults(searchResults.results, searchResults.searchIntent);
      
      // Update suggestions with AI recommendations
      if (searchResults.suggestions.length > 0) {
        const aiSuggestions = searchResults.suggestions.map(suggestion => ({
          text: suggestion,
          type: 'ai' as const,
          icon: <Brain className="h-3 w-3" />
        }));
        setSuggestions(prev => [...aiSuggestions, ...prev].slice(0, 6));
      }
    } catch (error) {
      console.error('Search failed:', error);
      // Fallback to basic search
      const lowerQuery = searchQuery.toLowerCase();
      const results = products.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        p.description.toLowerCase().includes(lowerQuery)
      );
      onSearchResults(results, `Found ${results.length} products matching "${searchQuery}"`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  const clearSearch = () => {
    setQuery('');
    setSearchIntent('');
    onSearchResults(products);
    searchInputRef.current?.focus();
  };

  const getSuggestionBadgeVariant = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'ai': return 'default';
      case 'trending': return 'secondary';
      case 'recent': return 'outline';
      default: return 'outline';
    }
  };

  const getSuggestionBadgeColor = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'ai': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0';
      case 'trending': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'recent': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return '';
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search className={`h-4 w-4 ${isSearching ? 'animate-pulse text-purple-500' : 'text-gray-400'}`} />
        </div>
        
        <Input
          ref={searchInputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="pl-10 pr-20 py-6 text-base border-2 border-gray-200 focus:border-purple-500 rounded-xl"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          {query && (
            <Button
              size="sm"
              variant="ghost"
              onClick={clearSearch}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            size="sm"
            onClick={() => handleSearch()}
            disabled={isSearching || !query.trim()}
            className="h-8 px-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isSearching ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Brain className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Search Intent Display */}
      {searchIntent && (
        <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800 font-medium">AI Understanding:</span>
            <span className="text-sm text-blue-700">{searchIntent}</span>
          </div>
        </div>
      )}

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-2 border-2 border-gray-200 shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Sparkles className="h-4 w-4" />
                Search Suggestions
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {suggestion.icon}
                      <span className="text-sm group-hover:text-purple-600 transition-colors">
                        {suggestion.text}
                      </span>
                    </div>
                    
                    <Badge 
                      variant={getSuggestionBadgeVariant(suggestion.type)}
                      className={`text-xs ${getSuggestionBadgeColor(suggestion.type)}`}
                    >
                      {suggestion.type === 'ai' ? 'AI' : suggestion.type === 'trending' ? 'Popular' : 'Recent'}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Click outside to close suggestions */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};