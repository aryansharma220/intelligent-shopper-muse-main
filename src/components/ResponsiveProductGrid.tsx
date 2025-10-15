import React, { useState, useMemo } from 'react';
import { ProductCard } from './ModernProductCard';
import { ProductCard as EnhancedProductCard } from './ProductCardEnhanced';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Grid,
  List,
  Filter,
  SortAsc,
  SortDesc,
  Search,
  X,
  Eye,
  Layout,
  LayoutGrid,
  Rows3
} from 'lucide-react';

interface ResponsiveProductGridProps {
  products: Product[];
  onProductView?: (product: Product) => void;
  onProductLike?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

type ViewMode = 'grid' | 'list' | 'compact';
type SortOption = 'name' | 'price-low' | 'price-high' | 'rating' | 'popularity';

export const ResponsiveProductGrid: React.FC<ResponsiveProductGridProps> = ({
  products,
  onProductView,
  onProductLike,
  onAddToCart,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 100000 });
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ['all', ...cats];
  }, [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Generate consistent ratings for sorting
    const withRatings = filtered.map(product => {
      const seed = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const rating = 3.5 + (seed % 1000) / 1000 * 1.5;
      const popularity = 60 + (seed % 40);
      
      return {
        ...product,
        rating: Number(rating.toFixed(1)),
        popularity
      };
    });

    // Sort products
    switch (sortBy) {
      case 'name':
        return withRatings.sort((a, b) => a.name.localeCompare(b.name));
      case 'price-low':
        return withRatings.sort((a, b) => a.price - b.price);
      case 'price-high':
        return withRatings.sort((a, b) => b.price - a.price);
      case 'rating':
        return withRatings.sort((a, b) => b.rating - a.rating);
      case 'popularity':
        return withRatings.sort((a, b) => b.popularity - a.popularity);
      default:
        return withRatings;
    }
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const getGridClasses = () => {
    switch (viewMode) {
      case 'grid':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6';
      case 'list':
        return 'grid grid-cols-1 gap-4';
      case 'compact':
        return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3';
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6';
    }
  };

  const getCardVariant = () => {
    switch (viewMode) {
      case 'list':
        return 'detailed';
      case 'compact':
        return 'compact';
      default:
        return 'default';
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange({ min: 0, max: 100000 });
    setSortBy('popularity');
  };

  const activeFiltersCount = [
    searchQuery,
    selectedCategory !== 'all',
    priceRange.min > 0 || priceRange.max < 100000
  ].filter(Boolean).length;

  return (
    <div className={`space-y-4 md:space-y-6 ${className}`}>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Products
          </h2>
          <Badge variant="secondary" className="text-sm">
            {filteredAndSortedProducts.length} items
          </Badge>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none px-3"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Grid</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none px-3"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">List</span>
            </Button>
            <Button
              variant={viewMode === 'compact' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none px-3"
              onClick={() => setViewMode('compact')}
            >
              <Rows3 className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Compact</span>
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Filters</span>
            {activeFiltersCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-purple-500 text-white"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Min Price (₹)</label>
              <Input
                type="number"
                placeholder="0"
                value={priceRange.min || ''}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) || 0 }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Max Price (₹)</label>
              <Input
                type="number"
                placeholder="100000"
                value={priceRange.max === 100000 ? '' : priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) || 100000 }))}
              />
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>
          Showing {filteredAndSortedProducts.length} of {products.length} products
        </span>
        <div className="flex items-center gap-2">
          <span>View:</span>
          <Badge variant="outline" className="capitalize">
            {viewMode}
          </Badge>
        </div>
      </div>

      {/* Products Grid */}
      {filteredAndSortedProducts.length > 0 ? (
        <div className={getGridClasses()}>
          {filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant={getCardVariant()}
              onView={onProductView}
              onLike={onProductLike}
              onAddToCart={onAddToCart}
              className={viewMode === 'list' ? 'w-full' : ''}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="space-y-3">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No products found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Try adjusting your search criteria or filters to find what you're looking for.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveProductGrid;