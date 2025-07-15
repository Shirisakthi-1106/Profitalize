
# 📊 Profitalyze


<div align="center">
  <p>Made by Team VoidMain - Sana, Shiri Sakthi, Shivani, Shriya</p>
  <p>
    <a href="https://youtu.be/wTRw4vTqh9U">🚀 Live Demo</a> 
  </p>
</div>


<div align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white" alt="Chart.js">
</div>

<p align="center">
  <strong>A web-based platform that simplifies data-driven decisions for e-commerce and retail</strong>
</p>

<p align="center">
  Transform your business with drag-and-drop workflows, real-time analytics, and AI-powered insights to optimize profitability.
</p>

---

## ✨ Key Features

### 🎯 **Drag-and-Drop Interface**
Build intuitive workflows by dragging products and deals into a visual workspace. No coding required!

### 📈 **Profit Margin Analytics**
Visualize profit margins by category with interactive charts and real-time data visualization.

### 🔍 **Deal Impact Analysis**
Analyze deal performance metrics through comprehensive modal views and detailed insights.

### 📊 **Flow Stats Dashboard**
Monitor workflow metrics including product counts, deal performance, and operational efficiency.

### 🤖 **AI-Powered Suggestions**
Get intelligent, dynamic suggestions to optimize your workflows and maximize profitability.

### 🏷️ **Category Filtering**
Easily filter products by categories like Fashion, Electronics, and more for targeted analysis.

### 📱 **Responsive Design**
Access a modern, accessible UI built with Tailwind CSS that works seamlessly across all devices.

### 🔧 **Resizable Analytics Panel**
Customize your workspace with adjustable panel sizes for optimal visibility and workflow efficiency.

---

## 🚀 Tech Stack

| **Frontend** | **Backend** | **Database** | **ML/AI** |
|-------------|-------------|--------------|-----------|
| React (Vite) | Express.js | Neon (PostgreSQL) | Random Forest Regression |
| Tailwind CSS | Node.js | Serverless | Machine Learning API |
| Chart.js | RESTful API | Cloud Database | Predictive Analytics |

---

## 📡 API Endpoints

### **Products**
```http
GET /api/v1/products
```
Fetch products with optional category filtering.

### **Analytics**
```http
GET /api/v1/profits/deal-impact-analysis    # Deal performance metrics
GET /api/v1/analytics/customer-transactions # Customer transaction data
GET /api/v1/analytics/deal-usage           # Deal usage statistics
GET /api/v1/analytics/loyalty-tiers        # Customer loyalty analysis
GET /api/v1/analytics/product-performance-with-cart # Product cart performance
GET /api/v1/analytics/cart-abandonment     # Cart abandonment tracking
```

### **Machine Learning**
```http
POST /api/v1/predictions/predict-margin
```
Get AI-powered profit margin predictions using Random Forest Regression.

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

### Quick Start
```bash
# Clone the repository
git clone https://github.com/yourusername/profitalyze.git
cd profitalyze

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start development server
npm run dev:frontend

# Start backend server
npm run dev:backend
```

### Environment Variables
```env
DATABASE_URL=your_neon_database_url
NODE_ENV=development
PORT=3000
```

---

## 🎮 Usage

1. **Product Management**: Drag products from the sidebar into your workflow canvas
2. **Deal Creation**: Create and analyze deals with real-time impact metrics
3. **Analytics Dashboard**: Monitor key performance indicators and profit margins
4. **AI Insights**: Leverage machine learning predictions for optimal pricing strategies
5. **Category Filtering**: Focus on specific product categories for targeted analysis

---

## 🔮 Future Roadmap

### 📱 **Mobile Optimization**
- Enhanced drag-and-drop functionality for touchscreens
- Mobile-first responsive design improvements

### 🧠 **Advanced AI Suggestions**
- Deeper machine learning insights for deal optimization
- Predictive analytics for market trends

### ⚡ **Real-Time Data Streams**
- Live data feeds for dynamic e-commerce updates
- WebSocket integration for instant analytics

### 👥 **Multi-User Collaboration**
- Team-based workflow editing
- Real-time collaborative features

### 📊 **Expanded Analytics**
- Cohort analysis and customer segmentation
- Predictive customer behavior modeling
- Advanced reporting and dashboard customization

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
