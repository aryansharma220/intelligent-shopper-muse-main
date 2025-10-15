import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle, 
  Clock, 
  Target,
  Bell,
  ArrowRightLeft,
  PieChart,
  Calculator,
  ShoppingCart,
  Lightbulb,
  Star,
  Filter
} from 'lucide-react';
import {
  intelligentAssistanceService,
  PricePrediction,
  BudgetPlan,
  StockAlert,
  ComparisonResult,
  ShoppingInsight
} from '@/services/intelligentAssistance';
import { UserProfile } from '@/services/personalizationService';
import AnalyticsDashboard from './AnalyticsDashboard';

interface IntelligentAssistanceDashboardProps {
  userProfile?: UserProfile;
  userId: string;
}

const IntelligentAssistanceDashboard: React.FC<IntelligentAssistanceDashboardProps> = ({
  userProfile,
  userId
}) => {
  const [activeTab, setActiveTab] = useState('insights');
  const [insights, setInsights] = useState<ShoppingInsight[]>([]);
  const [budgets, setBudgets] = useState<BudgetPlan[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [pricePredictions, setPricePredictions] = useState<PricePrediction[]>([]);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Price Prediction State
  const [selectedProduct, setSelectedProduct] = useState('');
  const [predictionDays, setPredictionDays] = useState(30);

  // Budget Creation State
  const [newBudgetName, setNewBudgetName] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [selectedBudget, setSelectedBudget] = useState<string>('');

  // Stock Alert State
  const [alertProductName, setAlertProductName] = useState('');
  const [alertType, setAlertType] = useState<'back_in_stock' | 'low_stock' | 'price_drop' | 'deal_alert'>('price_drop');

  // Comparison State
  const [comparisonProducts, setComparisonProducts] = useState<string[]>(['', '']);

  useEffect(() => {
    loadInitialData();
  }, [userId]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load smart recommendations
      const smartInsights = await intelligentAssistanceService.getSmartRecommendations(userId, userProfile);
      setInsights(smartInsights);

      // Load sample price predictions
      const sampleProducts = ['product1', 'product2', 'product3'];
      const predictions = await Promise.all(
        sampleProducts.map(id => intelligentAssistanceService.predictPrice(id))
      );
      setPricePredictions(predictions);

      // Check stock alerts
      const alerts = await intelligentAssistanceService.checkStockAlerts(userId);
      setStockAlerts(alerts);

    } catch (error) {
      console.error('Error loading intelligent assistance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePricePrediction = async () => {
    if (!selectedProduct) return;
    
    setLoading(true);
    try {
      const prediction = await intelligentAssistanceService.predictPrice(selectedProduct, predictionDays);
      setPricePredictions([prediction, ...pricePredictions.filter(p => p.productId !== selectedProduct)]);
    } catch (error) {
      console.error('Error predicting price:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async () => {
    if (!newBudgetName || !newBudgetAmount) return;

    setLoading(true);
    try {
      const budget = await intelligentAssistanceService.createBudgetPlan(userId, {
        name: newBudgetName,
        totalBudget: parseFloat(newBudgetAmount)
      });
      setBudgets([budget, ...budgets]);
      setNewBudgetName('');
      setNewBudgetAmount('');
    } catch (error) {
      console.error('Error creating budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStockAlert = async () => {
    if (!alertProductName) return;

    setLoading(true);
    try {
      const alert = await intelligentAssistanceService.createStockAlert(userId, {
        productName: alertProductName,
        productId: `alert_${Date.now()}`,
        alertType
      });
      setStockAlerts([alert, ...stockAlerts]);
      setAlertProductName('');
    } catch (error) {
      console.error('Error creating stock alert:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompareProducts = async () => {
    const validProducts = comparisonProducts.filter(p => p.trim());
    if (validProducts.length < 2) return;

    setLoading(true);
    try {
      const result = await intelligentAssistanceService.compareProducts(validProducts, userProfile);
      setComparisonResult(result);
    } catch (error) {
      console.error('Error comparing products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriceDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Lightbulb className="h-6 w-6 text-blue-500" />
        <h1 className="text-2xl font-bold">Intelligent Shopping Assistant</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <Lightbulb className="h-4 w-4" />
            <span>Smart Insights</span>
          </TabsTrigger>
          <TabsTrigger value="price" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Price Prediction</span>
          </TabsTrigger>
          <TabsTrigger value="budget" className="flex items-center space-x-2">
            <Calculator className="h-4 w-4" />
            <span>Budget Planner</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Stock Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="compare" className="flex items-center space-x-2">
            <ArrowRightLeft className="h-4 w-4" />
            <span>Smart Compare</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <PieChart className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Smart Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>Personalized Shopping Insights</span>
              </CardTitle>
              <CardDescription>
                AI-powered recommendations based on your shopping patterns and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {insights.map((insight, index) => (
                  <Alert key={index} className="border-l-4 border-l-blue-500">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="flex items-center justify-between">
                      <span>{insight.title}</span>
                      <Badge variant={getPriorityColor(insight.priority)}>
                        {insight.priority}
                      </Badge>
                    </AlertTitle>
                    <AlertDescription>
                      <p className="mb-2">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-600">{insight.action}</span>
                        {insight.savingsAmount && (
                          <span className="text-sm text-green-600 font-medium">
                            Save ₹{insight.savingsAmount.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">
                          Confidence: {(insight.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
                {insights.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No insights available. Start shopping to get personalized recommendations!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Price Prediction Tab */}
        <TabsContent value="price" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Price Prediction</span>
              </CardTitle>
              <CardDescription>
                Predict future prices and find the best time to buy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="product">Product ID</Label>
                  <Input
                    id="product"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    placeholder="Enter product ID"
                  />
                </div>
                <div className="w-32">
                  <Label htmlFor="days">Days</Label>
                  <Input
                    id="days"
                    type="number"
                    value={predictionDays}
                    onChange={(e) => setPredictionDays(parseInt(e.target.value))}
                    min="1"
                    max="90"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handlePricePrediction} disabled={loading}>
                    Predict Price
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {pricePredictions.map((prediction, index) => (
                  <Card key={index} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">{prediction.productId}</h3>
                        <div className="flex items-center space-x-2">
                          {getPriceDirectionIcon(prediction.priceDirection)}
                          <Badge variant={prediction.priceDirection === 'down' ? 'default' : 'secondary'}>
                            {prediction.priceDirection}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <Label className="text-sm text-gray-500">Current Price</Label>
                          <p className="text-lg font-semibold">₹{prediction.currentPrice}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500">Predicted Price</Label>
                          <p className="text-lg font-semibold">₹{prediction.predictedPrice}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500">Confidence</Label>
                          <p className="text-lg font-semibold">{(prediction.confidence * 100).toFixed(0)}%</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500">Best Buy Time</Label>
                          <p className="text-lg font-semibold">{prediction.bestBuyTime}</p>
                        </div>
                      </div>

                      {prediction.seasonalTrends.length > 0 && (
                        <div>
                          <Label className="text-sm text-gray-500 mb-2 block">Seasonal Trends</Label>
                          <div className="flex flex-wrap gap-2">
                            {prediction.seasonalTrends.map((trend, trendIndex) => (
                              <Badge key={trendIndex} variant="outline">
                                {trend.season}: {trend.averageDiscount}% off
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget Planner Tab */}
        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Budget Planner</span>
              </CardTitle>
              <CardDescription>
                Create and manage your shopping budgets with smart alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="budgetName">Budget Name</Label>
                  <Input
                    id="budgetName"
                    value={newBudgetName}
                    onChange={(e) => setNewBudgetName(e.target.value)}
                    placeholder="e.g., Monthly Shopping"
                  />
                </div>
                <div className="w-32">
                  <Label htmlFor="budgetAmount">Amount</Label>
                  <Input
                    id="budgetAmount"
                    type="number"
                    value={newBudgetAmount}
                    onChange={(e) => setNewBudgetAmount(e.target.value)}
                    placeholder="1000"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleCreateBudget} disabled={loading}>
                    Create Budget
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {budgets.map((budget, index) => (
                  <Card key={index} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">{budget.name}</h3>
                        <Badge variant={budget.remainingAmount < 0 ? 'destructive' : 'default'}>
                          ₹{budget.remainingAmount.toFixed(2)} remaining
                        </Badge>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-500">Budget Progress</span>
                          <span className="text-sm font-medium">
                            ₹{budget.spentAmount} / ₹{budget.totalBudget}
                          </span>
                        </div>
                        <Progress value={(budget.spentAmount / budget.totalBudget) * 100} />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {budget.categories.map((category, catIndex) => (
                          <div key={catIndex} className="border rounded p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">{category.name}</span>
                              <Badge variant="outline">
                                {category.priority}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-500">
                              ₹{category.spentAmount} / ₹{category.allocatedAmount}
                            </div>
                            <Progress 
                              value={(category.spentAmount / category.allocatedAmount) * 100} 
                              className="mt-2 h-2"
                            />
                          </div>
                        ))}
                      </div>

                      {budget.alerts.length > 0 && (
                        <div>
                          <Label className="text-sm text-gray-500 mb-2 block">Recent Alerts</Label>
                          <div className="space-y-2">
                            {budget.alerts.slice(0, 3).map((alert, alertIndex) => (
                              <Alert key={alertIndex} variant={alert.severity === 'error' ? 'destructive' : 'default'}>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{alert.message}</AlertDescription>
                              </Alert>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {budgets.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No budgets created yet. Create your first budget to start tracking expenses!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Stock Alerts</span>
              </CardTitle>
              <CardDescription>
                Get notified when products are back in stock or prices drop
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="alertProduct">Product Name</Label>
                  <Input
                    id="alertProduct"
                    value={alertProductName}
                    onChange={(e) => setAlertProductName(e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="w-40">
                  <Label htmlFor="alertType">Alert Type</Label>
                  <Select value={alertType} onValueChange={(value: any) => setAlertType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="back_in_stock">Back in Stock</SelectItem>
                      <SelectItem value="low_stock">Low Stock</SelectItem>
                      <SelectItem value="price_drop">Price Drop</SelectItem>
                      <SelectItem value="deal_alert">Deal Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleCreateStockAlert} disabled={loading}>
                    Create Alert
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {stockAlerts.map((alert, index) => (
                  <Card key={index} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{alert.productName}</h3>
                          <p className="text-sm text-gray-500">{alert.alertType.replace('_', ' ')}</p>
                          <p className="text-xs text-gray-400">
                            Created: {new Date(alert.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={alert.isActive ? 'default' : 'secondary'}>
                            {alert.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          {alert.triggeredAt && (
                            <Badge variant="destructive">Triggered</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {stockAlerts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No stock alerts set up. Create alerts to get notified about your favorite products!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart Compare Tab */}
        <TabsContent value="compare" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowRightLeft className="h-5 w-5" />
                <span>Smart Product Comparison</span>
              </CardTitle>
              <CardDescription>
                Compare products with AI-powered analysis based on your preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {comparisonProducts.map((product, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Label className="w-20">Product {index + 1}</Label>
                    <Input
                      value={product}
                      onChange={(e) => {
                        const newProducts = [...comparisonProducts];
                        newProducts[index] = e.target.value;
                        setComparisonProducts(newProducts);
                      }}
                      placeholder={`Enter product ${index + 1} ID`}
                    />
                  </div>
                ))}
                <div className="flex space-x-4">
                  <Button 
                    onClick={() => setComparisonProducts([...comparisonProducts, ''])}
                    variant="outline"
                  >
                    Add Product
                  </Button>
                  <Button onClick={handleCompareProducts} disabled={loading}>
                    Compare Products
                  </Button>
                </div>
              </div>

              {comparisonResult && (
                <Card className="border">
                  <CardContent className="p-4">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg mb-2">Comparison Results</h3>
                      <Alert>
                        <Star className="h-4 w-4" />
                        <AlertTitle>Winner: {comparisonResult.winner}</AlertTitle>
                        <AlertDescription>{comparisonResult.reasoning}</AlertDescription>
                      </Alert>
                    </div>

                    <div className="grid gap-4 mb-4">
                      {comparisonResult.products.map((product, index) => (
                        <div key={index} className="border rounded p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">{product.name}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge variant={index === 0 ? 'default' : 'secondary'}>
                                Score: {product.score}
                              </Badge>
                              <span className="text-lg font-bold">₹{product.price}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Rating:</span> {product.rating.toFixed(1)}/5
                            </div>
                            <div>
                              <span className="text-gray-500">Value:</span> {product.valueRating.toFixed(1)}/5
                            </div>
                          </div>

                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1 mb-2">
                              {product.features.map((feature, featureIndex) => (
                              <Badge key={featureIndex} variant="outline">
                                {feature}
                              </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-green-600 font-medium">Pros:</span>
                              <ul className="list-disc list-inside text-xs">
                                {product.pros.map((pro, proIndex) => (
                                  <li key={proIndex}>{pro}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="text-red-600 font-medium">Cons:</span>
                              <ul className="list-disc list-inside text-xs">
                                {product.cons.map((con, conIndex) => (
                                  <li key={conIndex}>{con}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <h4 className="font-medium mb-2">Comparison Factors</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                        {comparisonResult.factors.map((factor, index) => (
                          <div key={index} className="text-center">
                            <div className="text-sm font-medium">{factor.name}</div>
                            <div className="text-xs text-gray-500">{(factor.weight * 100).toFixed(0)}%</div>
                            <Badge variant="outline">{factor.importance}</Badge>
                          </div>
                        ))}
                      </div>

                      <h4 className="font-medium mb-2">Recommendations</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {comparisonResult.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsDashboard 
            userId={userId}
            userProfile={userProfile}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsDashboard 
            userId={userId}
            userProfile={userProfile}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelligentAssistanceDashboard;