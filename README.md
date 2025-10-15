# Intelligent Shopper Muse

An AI-powered e-commerce product recommendation system that combines collaborative filtering with LLM-generated explanations to provide personalized shopping experiences.

## 🚀 Features

- **Smart Product Recommendations**: AI-driven recommendations based on user behavior and preferences
- **Intelligent Search**: Advanced search with semantic understanding and smart suggestions
- **Real-time Analytics**: Comprehensive dashboard showing shopping insights and trends
- **Modern UI**: Responsive React interface built with TypeScript and Tailwind CSS
- **Category Filtering**: Browse products by category with real-time filtering
- **Session-based**: No login required - recommendations based on current browsing session
- **Performance Optimized**: Production-ready with code splitting and optimized builds

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Query** for data fetching and caching
- **React Router** for client-side routing

### Backend
- **Supabase** for database and authentication
- **Supabase Edge Functions** for serverless API endpoints
- **PostgreSQL** database with RLS (Row Level Security)

### AI Integration
- **Google Gemini AI** for generating recommendations and smart responses
- **Custom recommendation algorithm** using collaborative filtering

## 🚀 Quick Deploy to Vercel

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/intelligent-shopper-muse)

### Manual Deployment

1. **Fork or Clone this repository**
   ```bash
   git clone https://github.com/yourusername/intelligent-shopper-muse.git
   cd intelligent-shopper-muse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.production`
   - Add your API keys:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Deploy to Vercel**
   - Push your code to GitHub
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy!

## 🛠️ Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/intelligent-shopper-muse.git
   cd intelligent-shopper-muse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 📊 Database Schema

### Products Table
```sql
- id: UUID (Primary Key)
- name: TEXT
- description: TEXT
- price: DECIMAL(10, 2)
- category: TEXT
- image_url: TEXT
- tags: TEXT[]
- created_at: TIMESTAMP
```

### User Interactions Table
```sql
- id: UUID (Primary Key)
- session_id: TEXT
- product_id: UUID (Foreign Key)
- interaction_type: TEXT ('view', 'click', 'like')
- created_at: TIMESTAMP
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- OpenAI API account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd intelligent-shopper-muse
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"

# OpenAI API Key for LLM explanations
OPENAI_API_KEY="your-openai-api-key-here"
```

### 4. Database Setup
1. Create a new Supabase project
2. Run the migration file: `supabase/migrations/20251015100006_bb1039d6-87e1-42b9-a367-fc9e9ec13422.sql`
3. This will create the tables and insert sample products

### 5. Deploy Supabase Functions
```bash
supabase functions deploy get-recommendations
```

### 6. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## 🤖 Recommendation Algorithm

The system uses a hybrid approach combining:

1. **Collaborative Filtering**: Analyzes user interactions to find similar preferences
2. **Content-based Filtering**: Matches products based on categories and tags
3. **Scoring System**: 
   - +3 points for matching category
   - +1 point for each matching tag
4. **LLM Enhancement**: OpenAI generates personalized explanations for each recommendation

### Example API Usage

```javascript
// Get recommendations for a session
const response = await supabase.functions.invoke('get-recommendations', {
  body: { sessionId: 'user-session-id' }
});

// Returns:
{
  recommendations: [
    {
      product: { id, name, description, price, category, image_url },
      explanation: "Based on your interest in electronics and fitness tracking...",
      score: 4
    }
  ]
}
```

## 🎯 Usage

1. **Browse Products**: View the product catalog with category filters
2. **Interact**: Click on products, like items to build your preference profile
3. **Get Recommendations**: Click "Get Recommendations" to receive personalized suggestions
4. **View Explanations**: Each recommendation includes an AI-generated explanation

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── components/          # React components
│   ├── ProductCard.tsx  # Individual product display
│   ├── RecommendationCard.tsx  # Recommendation with explanation
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── lib/                # Utility functions
└── pages/              # Page components
    ├── Index.tsx       # Main page
    └── NotFound.tsx    # 404 page
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Build
```bash
npm run build
# Deploy the `dist/` folder to your hosting provider
```

## 🔐 Security

- Database uses Row Level Security (RLS)
- API keys secured with environment variables
- No user data stored - only session-based interactions
- CORS properly configured for cross-origin requests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React and TypeScript
- UI components from shadcn/ui
- Database and backend powered by Supabase
- AI explanations powered by OpenAI
- Icons from Lucide React
