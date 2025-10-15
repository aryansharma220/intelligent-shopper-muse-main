export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  tags: string[];
  created_at: string;
}

export interface UserInteraction {
  id: string;
  session_id: string;
  product_id: string;
  interaction_type: 'view' | 'click' | 'like';
  created_at: string;
}

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

// Generate placeholder image with category color coding
const getPlaceholderImage = (category: string, name: string) => {
  const categoryColors = {
    'Electronics': '3b82f6/ffffff', // Blue
    'Fashion': 'ec4899/ffffff', // Pink
    'Home & Kitchen': '10b981/ffffff', // Green
    'Sports & Fitness': 'f59e0b/ffffff', // Orange
    'Books & Stationery': '8b5cf6/ffffff', // Purple
    'Accessories': '6b7280/ffffff', // Gray
    'Personal Care': 'f97316/ffffff', // Orange
    'Grocery & Food': '84cc16/ffffff', // Lime
    'Baby & Kids': 'f472b6/ffffff', // Pink
    'Automotive': '1f2937/ffffff', // Dark gray
    'Garden & Outdoor': '22c55e/ffffff' // Green
  };
  
  const color = categoryColors[category as keyof typeof categoryColors] || '6b7280/ffffff';
  const text = encodeURIComponent(name.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 20));
  return `https://via.placeholder.com/400x300/${color}?text=${text}`;
};

export const products: Product[] = [
  // Electronics
  {
    id: generateId(),
    name: 'Wireless Headphones',
    description: 'Premium noise-canceling headphones with 30-hour battery life',
    price: 24999.00,
    category: 'Electronics',
    image_url: getPlaceholderImage('Electronics', 'Wireless Headphones'),
    tags: ['audio', 'wireless', 'premium'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Smart Watch',
    description: 'Fitness tracker with heart rate monitor and GPS',
    price: 15999.00,
    category: 'Electronics',
    image_url: getPlaceholderImage('Electronics', 'Smart Watch'),
    tags: ['wearable', 'fitness', 'smart'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof speaker with 12-hour battery',
    price: 4999.00,
    category: 'Electronics',
    image_url: getPlaceholderImage('Electronics', 'Bluetooth Speaker'),
    tags: ['audio', 'portable', 'wireless'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Smartphone',
    description: 'Latest Android smartphone with 128GB storage',
    price: 19999.00,
    category: 'Electronics',
    image_url: getPlaceholderImage('Electronics', 'Smartphone'),
    tags: ['mobile', 'android', 'camera'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Laptop',
    description: 'Lightweight laptop for work and entertainment',
    price: 45999.00,
    category: 'Electronics',
    image_url: getPlaceholderImage('Electronics', 'Laptop'),
    tags: ['computer', 'work', 'portable'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Tablet',
    description: '10-inch tablet perfect for reading and streaming',
    price: 22999.00,
    category: 'Electronics',
    image_url: getPlaceholderImage('Electronics', 'Tablet'),
    tags: ['tablet', 'entertainment', 'portable'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Power Bank',
    description: '20,000mAh portable power bank with fast charging',
    price: 2499.00,
    category: 'Electronics',
    image_url: getPlaceholderImage('Electronics', 'Power Bank'),
    tags: ['power', 'portable', 'charging'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Gaming Headset',
    description: 'Professional gaming headset with 7.1 surround sound',
    price: 6999.00,
    category: 'Electronics',
    image_url: getPlaceholderImage('Electronics', 'Gaming Headset'),
    tags: ['gaming', 'audio', 'professional'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'USB Cable',
    description: 'Type-C USB cable with fast data transfer',
    price: 299.00,
    category: 'Electronics',
    image_url: getPlaceholderImage('Electronics', 'USB Cable'),
    tags: ['cable', 'usb', 'charging'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Webcam',
    description: 'HD webcam for video calls and streaming',
    price: 3499.00,
    category: 'Electronics',
    image_url: getPlaceholderImage('Electronics', 'Webcam'),
    tags: ['camera', 'video', 'streaming'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Router',
    description: 'High-speed WiFi router for home and office',
    price: 4999.00,
    category: 'Electronics',
    image_url: getPlaceholderImage('Electronics', 'Router'),
    tags: ['networking', 'wifi', 'internet'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Memory Card',
    description: '128GB microSD card for phones and cameras',
    price: 1499.00,
    category: 'Electronics',
    image_url: getPlaceholderImage('Electronics', 'Memory Card'),
    tags: ['storage', 'memory', 'microsd'],
    created_at: new Date().toISOString()
  },

  // Fashion & Clothing
  {
    id: generateId(),
    name: 'Running Shoes',
    description: 'Lightweight running shoes with responsive cushioning',
    price: 8999.00,
    category: 'Fashion',
    image_url: getPlaceholderImage('Fashion', 'Running Shoes'),
    tags: ['footwear', 'running', 'sports'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Casual T-Shirt',
    description: 'Premium cotton t-shirt for everyday wear',
    price: 999.00,
    category: 'Fashion',
    image_url: getPlaceholderImage('Fashion', 'Casual T-Shirt'),
    tags: ['clothing', 'casual', 'cotton'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Denim Jeans',
    description: 'Classic fit denim jeans for men',
    price: 2499.00,
    category: 'Fashion',
    image_url: getPlaceholderImage('Fashion', 'Denim Jeans'),
    tags: ['clothing', 'denim', 'casual'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Ethnic Kurta',
    description: 'Traditional cotton kurta for festive occasions',
    price: 1899.00,
    category: 'Fashion',
    image_url: getPlaceholderImage('Fashion', 'Ethnic Kurta'),
    tags: ['traditional', 'ethnic', 'festive'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Saree',
    description: 'Elegant silk saree for special occasions',
    price: 8999.00,
    category: 'Fashion',
    image_url: getPlaceholderImage('Fashion', 'Saree'),
    tags: ['traditional', 'silk', 'ethnic'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Leggings',
    description: 'Comfortable leggings for yoga and casual wear',
    price: 899.00,
    category: 'Fashion',
    image_url: getPlaceholderImage('Fashion', 'Leggings'),
    tags: ['clothing', 'activewear', 'comfort'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Formal Shirt',
    description: 'Crisp white formal shirt for office wear',
    price: 1899.00,
    category: 'Fashion',
    image_url: getPlaceholderImage('Fashion', 'Formal Shirt'),
    tags: ['formal', 'office', 'shirt'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Ethnic Dupatta',
    description: 'Silk dupatta to complete your ethnic look',
    price: 999.00,
    category: 'Fashion',
    image_url: getPlaceholderImage('Fashion', 'Ethnic Dupatta'),
    tags: ['ethnic', 'silk', 'accessories'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Winter Jacket',
    description: 'Warm winter jacket for cold weather',
    price: 3999.00,
    category: 'Fashion',
    image_url: getPlaceholderImage('Fashion', 'Winter Jacket'),
    tags: ['winter', 'jacket', 'warm'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Sneakers',
    description: 'Casual sneakers for everyday wear',
    price: 2999.00,
    category: 'Fashion',
    image_url: getPlaceholderImage('Fashion', 'Sneakers'),
    tags: ['footwear', 'casual', 'comfort'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Salwar Suit',
    description: 'Traditional salwar suit with embroidery',
    price: 2999.00,
    category: 'Fashion',
    image_url: getPlaceholderImage('Fashion', 'Salwar Suit'),
    tags: ['traditional', 'ethnic', 'embroidery'],
    created_at: new Date().toISOString()
  },

  // Home & Kitchen
  {
    id: generateId(),
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe',
    price: 6999.00,
    category: 'Home & Kitchen',
    image_url: getPlaceholderImage('Home & Kitchen', 'Coffee Maker'),
    tags: ['kitchen', 'coffee', 'appliance'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Air Fryer',
    description: 'Healthy cooking with oil-free air frying technology',
    price: 8999.00,
    category: 'Home & Kitchen',
    image_url: getPlaceholderImage('Home & Kitchen', 'Air Fryer'),
    tags: ['kitchen', 'healthy', 'cooking'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Rice Cooker',
    description: 'Electric rice cooker perfect for Indian households',
    price: 3999.00,
    category: 'Home & Kitchen',
    image_url: getPlaceholderImage('Home & Kitchen', 'Rice Cooker'),
    tags: ['kitchen', 'rice', 'cooking'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Mixer Grinder',
    description: 'Powerful 3-jar mixer grinder for Indian cooking',
    price: 4999.00,
    category: 'Home & Kitchen',
    image_url: getPlaceholderImage('Home & Kitchen', 'Mixer Grinder'),
    tags: ['kitchen', 'grinding', 'cooking'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Pressure Cooker',
    description: 'Stainless steel pressure cooker - 5 litre capacity',
    price: 2999.00,
    category: 'Home & Kitchen',
    image_url: getPlaceholderImage('Home & Kitchen', 'Pressure Cooker'),
    tags: ['kitchen', 'cooking', 'steel'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'LED Desk Lamp',
    description: 'Adjustable LED desk lamp with touch control',
    price: 2499.00,
    category: 'Home & Kitchen',
    image_url: getPlaceholderImage('Home & Kitchen', 'LED Desk Lamp'),
    tags: ['lighting', 'office', 'led'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Water Purifier',
    description: 'RO water purifier for safe drinking water',
    price: 12999.00,
    category: 'Home & Kitchen',
    image_url: getPlaceholderImage('Home & Kitchen', 'Water Purifier'),
    tags: ['water', 'purifier', 'health'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Induction Cooktop',
    description: 'Energy-efficient induction cooktop',
    price: 3999.00,
    category: 'Home & Kitchen',
    image_url: getPlaceholderImage('Home & Kitchen', 'Induction Cooktop'),
    tags: ['cooking', 'induction', 'energy'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Microwave Oven',
    description: 'Convection microwave for modern kitchens',
    price: 8999.00,
    category: 'Home & Kitchen',
    image_url: getPlaceholderImage('Home & Kitchen', 'Microwave Oven'),
    tags: ['microwave', 'convection', 'kitchen'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Dinner Set',
    description: 'Elegant 24-piece dinner set for family',
    price: 2999.00,
    category: 'Home & Kitchen',
    image_url: getPlaceholderImage('Home & Kitchen', 'Dinner Set'),
    tags: ['dinnerware', 'ceramic', 'family'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Bed Sheets',
    description: 'Cotton bed sheet set with pillowcases',
    price: 1999.00,
    category: 'Home & Kitchen',
    image_url: getPlaceholderImage('Home & Kitchen', 'Bed Sheets'),
    tags: ['bedding', 'cotton', 'comfort'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Curtains',
    description: 'Blackout curtains for better sleep',
    price: 1499.00,
    category: 'Home & Kitchen',
    image_url: getPlaceholderImage('Home & Kitchen', 'Curtains'),
    tags: ['curtains', 'blackout', 'bedroom'],
    created_at: new Date().toISOString()
  },

  // Sports & Fitness
  {
    id: generateId(),
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat with carrying strap',
    price: 1999.00,
    category: 'Sports & Fitness',
    image_url: getPlaceholderImage('Sports & Fitness', 'Yoga Mat'),
    tags: ['fitness', 'yoga', 'exercise'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Cricket Bat',
    description: 'Professional grade cricket bat for serious players',
    price: 4999.00,
    category: 'Sports & Fitness',
    image_url: getPlaceholderImage('Sports & Fitness', 'Cricket Bat'),
    tags: ['cricket', 'sports', 'outdoor'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Badminton Racket',
    description: 'Lightweight badminton racket with cover',
    price: 2999.00,
    category: 'Sports & Fitness',
    image_url: getPlaceholderImage('Sports & Fitness', 'Badminton Racket'),
    tags: ['badminton', 'sports', 'indoor'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Dumbbells Set',
    description: 'Adjustable dumbbells for home workout',
    price: 3999.00,
    category: 'Sports & Fitness',
    image_url: getPlaceholderImage('Sports & Fitness', 'Dumbbells Set'),
    tags: ['fitness', 'strength', 'home'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Football',
    description: 'Official size football for outdoor games',
    price: 1499.00,
    category: 'Sports & Fitness',
    image_url: getPlaceholderImage('Sports & Fitness', 'Football'),
    tags: ['football', 'sports', 'outdoor'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Treadmill',
    description: 'Foldable treadmill for home workouts',
    price: 35999.00,
    category: 'Sports & Fitness',
    image_url: getPlaceholderImage('Sports & Fitness', 'Treadmill'),
    tags: ['fitness', 'cardio', 'home'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Chess Set',
    description: 'Wooden chess set for strategic minds',
    price: 1999.00,
    category: 'Sports & Fitness',
    image_url: getPlaceholderImage('Sports & Fitness', 'Chess Set'),
    tags: ['chess', 'strategy', 'wooden'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Cycling Gloves',
    description: 'Padded gloves for comfortable cycling',
    price: 799.00,
    category: 'Sports & Fitness',
    image_url: getPlaceholderImage('Sports & Fitness', 'Cycling Gloves'),
    tags: ['cycling', 'gloves', 'comfort'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Protein Powder',
    description: 'Whey protein for muscle building',
    price: 2999.00,
    category: 'Sports & Fitness',
    image_url: getPlaceholderImage('Sports & Fitness', 'Protein Powder'),
    tags: ['nutrition', 'protein', 'fitness'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Exercise Bike',
    description: 'Stationary exercise bike for cardio',
    price: 18999.00,
    category: 'Sports & Fitness',
    image_url: getPlaceholderImage('Sports & Fitness', 'Exercise Bike'),
    tags: ['cardio', 'bike', 'home'],
    created_at: new Date().toISOString()
  },

  // Books & Stationery
  {
    id: generateId(),
    name: 'Programming Book',
    description: 'Learn Python programming from basics to advanced',
    price: 899.00,
    category: 'Books & Stationery',
    image_url: getPlaceholderImage('Books & Stationery', 'Programming Book'),
    tags: ['books', 'programming', 'education'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Notebook Set',
    description: 'Set of 5 premium quality notebooks',
    price: 499.00,
    category: 'Books & Stationery',
    image_url: getPlaceholderImage('Books & Stationery', 'Notebook Set'),
    tags: ['stationery', 'writing', 'office'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Fountain Pen',
    description: 'Classic fountain pen for smooth writing',
    price: 1999.00,
    category: 'Books & Stationery',
    image_url: getPlaceholderImage('Books & Stationery', 'Fountain Pen'),
    tags: ['pen', 'writing', 'premium'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Mathematics Guide',
    description: 'Complete guide for competitive exams',
    price: 699.00,
    category: 'Books & Stationery',
    image_url: getPlaceholderImage('Books & Stationery', 'Mathematics Guide'),
    tags: ['education', 'mathematics', 'competitive'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Art Supplies Kit',
    description: 'Complete art kit with brushes and colors',
    price: 1999.00,
    category: 'Books & Stationery',
    image_url: getPlaceholderImage('Books & Stationery', 'Art Supplies Kit'),
    tags: ['art', 'creativity', 'painting'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Planner',
    description: '2025 daily planner for organization',
    price: 899.00,
    category: 'Books & Stationery',
    image_url: getPlaceholderImage('Books & Stationery', 'Planner'),
    tags: ['planning', 'organization', 'diary'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Calculator',
    description: 'Scientific calculator for students',
    price: 1299.00,
    category: 'Books & Stationery',
    image_url: getPlaceholderImage('Books & Stationery', 'Calculator'),
    tags: ['calculator', 'education', 'science'],
    created_at: new Date().toISOString()
  },

  // Accessories
  {
    id: generateId(),
    name: 'Laptop Backpack',
    description: 'Durable backpack with padded laptop compartment',
    price: 2999.00,
    category: 'Accessories',
    image_url: getPlaceholderImage('Accessories', 'Laptop Backpack'),
    tags: ['bag', 'travel', 'laptop'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Sunglasses',
    description: 'UV protection sunglasses with polarized lenses',
    price: 1999.00,
    category: 'Accessories',
    image_url: getPlaceholderImage('Accessories', 'Sunglasses'),
    tags: ['sunglasses', 'fashion', 'uv'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Wallet',
    description: 'Genuine leather wallet with multiple card slots',
    price: 1499.00,
    category: 'Accessories',
    image_url: getPlaceholderImage('Accessories', 'Wallet'),
    tags: ['wallet', 'leather', 'accessories'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Watch',
    description: 'Analog wrist watch with leather strap',
    price: 3999.00,
    category: 'Accessories',
    image_url: getPlaceholderImage('Accessories', 'Watch'),
    tags: ['watch', 'analog', 'fashion'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Phone Case',
    description: 'Shockproof case for smartphone protection',
    price: 599.00,
    category: 'Accessories',
    image_url: getPlaceholderImage('Accessories', 'Phone Case'),
    tags: ['phone', 'protection', 'case'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Earphones',
    description: 'Wired earphones with mic for calls',
    price: 899.00,
    category: 'Accessories',
    image_url: getPlaceholderImage('Accessories', 'Earphones'),
    tags: ['audio', 'wired', 'calls'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Belt',
    description: 'Genuine leather belt for formal wear',
    price: 1299.00,
    category: 'Accessories',
    image_url: getPlaceholderImage('Accessories', 'Belt'),
    tags: ['belt', 'leather', 'formal'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Hair Clips',
    description: 'Set of decorative hair clips for women',
    price: 299.00,
    category: 'Accessories',
    image_url: getPlaceholderImage('Accessories', 'Hair Clips'),
    tags: ['hair', 'clips', 'decorative'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Keychain',
    description: 'Stylish keychain with LED light',
    price: 199.00,
    category: 'Accessories',
    image_url: getPlaceholderImage('Accessories', 'Keychain'),
    tags: ['keychain', 'led', 'utility'],
    created_at: new Date().toISOString()
  },

  // Personal Care
  {
    id: generateId(),
    name: 'Face Wash',
    description: 'Gentle face wash for all skin types',
    price: 299.00,
    category: 'Personal Care',
    image_url: getPlaceholderImage('Personal Care', 'Face Wash'),
    tags: ['skincare', 'cleansing', 'face'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Hair Oil',
    description: 'Natural hair oil for strong and healthy hair',
    price: 399.00,
    category: 'Personal Care',
    image_url: getPlaceholderImage('Personal Care', 'Hair Oil'),
    tags: ['haircare', 'natural', 'oil'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Perfume',
    description: 'Long-lasting fragrance for men and women',
    price: 1999.00,
    category: 'Personal Care',
    image_url: getPlaceholderImage('Personal Care', 'Perfume'),
    tags: ['fragrance', 'perfume', 'unisex'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Shampoo',
    description: 'Anti-dandruff shampoo for healthy scalp',
    price: 499.00,
    category: 'Personal Care',
    image_url: getPlaceholderImage('Personal Care', 'Shampoo'),
    tags: ['haircare', 'shampoo', 'dandruff'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Sunscreen',
    description: 'SPF 50+ sunscreen for Indian weather',
    price: 599.00,
    category: 'Personal Care',
    image_url: getPlaceholderImage('Personal Care', 'Sunscreen'),
    tags: ['skincare', 'sun protection', 'spf'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Body Lotion',
    description: 'Moisturizing body lotion for dry skin',
    price: 449.00,
    category: 'Personal Care',
    image_url: getPlaceholderImage('Personal Care', 'Body Lotion'),
    tags: ['skincare', 'moisturizer', 'body'],
    created_at: new Date().toISOString()
  },

  // Grocery & Food
  {
    id: generateId(),
    name: 'Basmati Rice',
    description: 'Premium quality basmati rice - 5kg pack',
    price: 699.00,
    category: 'Grocery & Food',
    image_url: getPlaceholderImage('Grocery & Food', 'Basmati Rice'),
    tags: ['rice', 'basmati', 'staple'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Green Tea',
    description: 'Organic green tea bags - pack of 100',
    price: 499.00,
    category: 'Grocery & Food',
    image_url: getPlaceholderImage('Grocery & Food', 'Green Tea'),
    tags: ['tea', 'organic', 'health'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Olive Oil',
    description: 'Extra virgin olive oil for cooking',
    price: 899.00,
    category: 'Grocery & Food',
    image_url: getPlaceholderImage('Grocery & Food', 'Olive Oil'),
    tags: ['oil', 'cooking', 'healthy'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Almonds',
    description: 'Premium California almonds - 1kg pack',
    price: 1299.00,
    category: 'Grocery & Food',
    image_url: getPlaceholderImage('Grocery & Food', 'Almonds'),
    tags: ['nuts', 'healthy', 'snack'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Honey',
    description: 'Pure natural honey - 500g bottle',
    price: 399.00,
    category: 'Grocery & Food',
    image_url: getPlaceholderImage('Grocery & Food', 'Honey'),
    tags: ['honey', 'natural', 'sweetener'],
    created_at: new Date().toISOString()
  },

  // Baby & Kids
  {
    id: generateId(),
    name: 'Baby Diapers',
    description: 'Ultra-soft diapers for newborns - pack of 60',
    price: 1299.00,
    category: 'Baby & Kids',
    image_url: getPlaceholderImage('Baby & Kids', 'Baby Diapers'),
    tags: ['baby', 'diapers', 'comfort'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Toy Car',
    description: 'Remote control racing car for kids',
    price: 1999.00,
    category: 'Baby & Kids',
    image_url: getPlaceholderImage('Baby & Kids', 'Toy Car'),
    tags: ['toys', 'car', 'remote'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Educational Book',
    description: 'Interactive learning book for children',
    price: 599.00,
    category: 'Baby & Kids',
    image_url: getPlaceholderImage('Baby & Kids', 'Educational Book'),
    tags: ['education', 'kids', 'learning'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Baby Bottle',
    description: 'BPA-free feeding bottle with nipple',
    price: 299.00,
    category: 'Baby & Kids',
    image_url: getPlaceholderImage('Baby & Kids', 'Baby Bottle'),
    tags: ['feeding', 'bottle', 'safe'],
    created_at: new Date().toISOString()
  },

  // Automotive
  {
    id: generateId(),
    name: 'Car Charger',
    description: 'Dual port car charger for phones',
    price: 699.00,
    category: 'Automotive',
    image_url: getPlaceholderImage('Automotive', 'Car Charger'),
    tags: ['car', 'charger', 'dual'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Air Freshener',
    description: 'Long-lasting car air freshener',
    price: 199.00,
    category: 'Automotive',
    image_url: getPlaceholderImage('Automotive', 'Air Freshener'),
    tags: ['car', 'freshener', 'fragrance'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Car Polish',
    description: 'Premium car polish for shine',
    price: 499.00,
    category: 'Automotive',
    image_url: getPlaceholderImage('Automotive', 'Car Polish'),
    tags: ['car', 'polish', 'shine'],
    created_at: new Date().toISOString()
  },

  // Garden & Outdoor
  {
    id: generateId(),
    name: 'Garden Tools Set',
    description: 'Complete gardening tools for home gardens',
    price: 2999.00,
    category: 'Garden & Outdoor',
    image_url: getPlaceholderImage('Garden & Outdoor', 'Garden Tools Set'),
    tags: ['gardening', 'tools', 'outdoor'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Plant Pot',
    description: 'Ceramic plant pot for indoor plants',
    price: 699.00,
    category: 'Garden & Outdoor',
    image_url: getPlaceholderImage('Garden & Outdoor', 'Plant Pot'),
    tags: ['plants', 'pot', 'ceramic'],
    created_at: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Fertilizer',
    description: 'Organic fertilizer for healthy plants',
    price: 399.00,
    category: 'Garden & Outdoor',
    image_url: getPlaceholderImage('Garden & Outdoor', 'Fertilizer'),
    tags: ['fertilizer', 'organic', 'plants'],
    created_at: new Date().toISOString()
  }
];

// Mock user interactions storage
export let userInteractions: UserInteraction[] = [];

// Local storage functions
export const addUserInteraction = (sessionId: string, productId: string, interactionType: 'view' | 'click' | 'like') => {
  const interaction: UserInteraction = {
    id: generateId(),
    session_id: sessionId,
    product_id: productId,
    interaction_type: interactionType,
    created_at: new Date().toISOString()
  };
  userInteractions.push(interaction);
  
  // Store in localStorage for persistence
  localStorage.setItem('userInteractions', JSON.stringify(userInteractions));
};

export const getUserInteractions = (sessionId?: string) => {
  // Load from localStorage on first call
  const stored = localStorage.getItem('userInteractions');
  if (stored && userInteractions.length === 0) {
    userInteractions = JSON.parse(stored);
  }
  
  if (sessionId) {
    return userInteractions.filter(interaction => interaction.session_id === sessionId);
  }
  return userInteractions;
};

// Product filtering and search functions
export const getProductsByCategory = (category: string) => {
  return products.filter(product => product.category === category);
};

export const searchProducts = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getProductById = (id: string) => {
  return products.find(product => product.id === id);
};

export const getAllCategories = () => {
  return [...new Set(products.map(product => product.category))];
};

export const getProductsByPriceRange = (minPrice: number, maxPrice: number) => {
  return products.filter(product => product.price >= minPrice && product.price <= maxPrice);
};

// Generate session ID for tracking
export const generateSessionId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Export placeholder image generator
export { getPlaceholderImage };