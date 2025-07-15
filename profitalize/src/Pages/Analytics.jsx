import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, FunnelChart, Funnel, LabelList } from 'recharts';
import { TrendingUp, Users, ShoppingCart, Gift, Target, DollarSign } from 'lucide-react';

const CustomerAnalyticsDashboard = () => {
  // Sample data
  const customerTransactions = [
    { customer_id: 1, total_spending: 1149, name: "Customer 1" },
    { customer_id: 3, total_spending: 809.99, name: "Customer 3" },
    { customer_id: 5, total_spending: 341.99, name: "Customer 5" },
    { customer_id: 4, total_spending: 130, name: "Customer 4" },
    { customer_id: 2, total_spending: 19.47, name: "Customer 2" }
  ];

  const loyaltyTiers = [
    { loyalty_tier: "Silver", count: 2 },
    { loyalty_tier: "Platinum", count: 1 },
    { loyalty_tier: "Bronze", count: 1 },
    { loyalty_tier: "Gold", count: 1 }
  ];

  const productPerformance = [
    { customer_id: 1, category_id: 9, volume: 1, category_name: "Electronics" },
    { customer_id: 2, category_id: 8, volume: 1, category_name: "Home & Garden" },
    { customer_id: 3, category_id: 2, volume: 1, category_name: "Fashion" },
    { customer_id: 5, category_id: 11, volume: 1, category_name: "Sports" }
  ];

  const cartAbandonment = [
    { stage: "Cart Initiated", count: 7, value: 7 },
    { stage: "Purchase Completed", count: 5, value: 5 }
  ];

  const dealUsage = [
    {
      loyalty_tier: "Gold",
      deals: [
        { deal_id: 1, count: 0 },
        { deal_id: 2, count: 1 },
        { deal_id: 3, count: 0 },
        { deal_id: 4, count: 0 },
        { deal_id: 5, count: 0 }
      ]
    },
    {
      loyalty_tier: "Silver",
      deals: [
        { deal_id: 1, count: 1 },
        { deal_id: 2, count: 0 },
        { deal_id: 3, count: 0 },
        { deal_id: 4, count: 0 },
        { deal_id: 5, count: 0 }
      ]
    },
    {
      loyalty_tier: "Bronze",
      deals: [
        { deal_id: 1, count: 0 },
        { deal_id: 2, count: 1 },
        { deal_id: 3, count: 0 },
        { deal_id: 4, count: 0 },
        { deal_id: 5, count: 0 }
      ]
    },
    {
      loyalty_tier: "None",
      deals: [
        { deal_id: 1, count: 0 },
        { deal_id: 2, count: 0 },
        { deal_id: 3, count: 1 },
        { deal_id: 4, count: 0 },
        { deal_id: 5, count: 0 }
      ]
    }
  ];

  // Process deal usage data for radar chart
  const dealRadarData = dealUsage.map(tier => ({
    tier: tier.loyalty_tier,
    deal1: tier.deals.find(d => d.deal_id === 1)?.count || 0,
    deal2: tier.deals.find(d => d.deal_id === 2)?.count || 0,
    deal3: tier.deals.find(d => d.deal_id === 3)?.count || 0,
    deal4: tier.deals.find(d => d.deal_id === 4)?.count || 0,
    deal5: tier.deals.find(d => d.deal_id === 5)?.count || 0,
  }));

  // Color schemes
  const colors = {
    primary: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'],
    secondary: ['#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63'],
    accent: ['#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f'],
    success: ['#10b981', '#059669', '#047857', '#065f46', '#064e3b'],
    warm: ['#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d']
  };

  const tierColors = {
    'Platinum': '#e5e7eb',
    'Gold': '#fbbf24',
    'Silver': '#9ca3af',
    'Bronze': '#d97706',
    'None': '#6b7280'
  };

  // Key metrics
  const totalRevenue = customerTransactions.reduce((sum, customer) => sum + customer.total_spending, 0);
  const avgSpending = totalRevenue / customerTransactions.length;
  const conversionRate = (cartAbandonment.find(stage => stage.stage === "Purchase Completed")?.count / 
                         cartAbandonment.find(stage => stage.stage === "Cart Initiated")?.count * 100) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Customer Analytics Dashboard</h1>
          <p className="text-gray-600">Real-time insights into customer behavior and business performance</p>
        </div>


        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. Customer Spending - Gradient Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Customer Spending Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={customerTransactions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value) => [`$${value}`, 'Total Spending']}
                />
                <Bar dataKey="total_spending" fill="url(#spendingGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 2. Loyalty Tiers - Donut Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Loyalty Tier Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={loyaltyTiers}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {loyaltyTiers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={tierColors[entry.loyalty_tier]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {loyaltyTiers.map((tier) => (
                <div key={tier.loyalty_tier} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: tierColors[tier.loyalty_tier] }}
                  />
                  <span className="text-sm text-gray-600">{tier.loyalty_tier}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Product Performance - Animated Line Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2 text-orange-600" />
              Category Performance Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category_name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value) => [`${value} orders`, 'Volume']}
                />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#d97706' }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-700">
                <strong>Trend:</strong> All categories showing steady performance with Electronics leading
              </p>
            </div>
          </div>

          {/* 4. Cart Abandonment - Funnel-style Area Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-red-600" />
              Conversion Funnel
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cartAbandonment}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="stage" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">
                <strong>Abandonment Rate:</strong> {((cartAbandonment[0].count - cartAbandonment[1].count) / cartAbandonment[0].count * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* 5. Deal Usage - Radar Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Gift className="w-5 h-5 mr-2 text-purple-600" />
              Deal Usage by Loyalty Tier
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={dealRadarData}>
                <PolarGrid gridType="polygon" />
                <PolarAngleAxis dataKey="tier" />
                <PolarRadiusAxis angle={90} domain={[0, 1]} />
                <Radar
                  name="Deal 1"
                  dataKey="deal1"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Deal 2"
                  dataKey="deal2"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Deal 3"
                  dataKey="deal3"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Deal 4"
                  dataKey="deal4"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Deal 5"
                  dataKey="deal5"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.3}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {['Deal 1', 'Deal 2', 'Deal 3', 'Deal 4', 'Deal 5'].map((deal, index) => (
                <div key={deal} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: colors.primary[index] }}
                  />
                  <span className="text-sm text-gray-600">{deal}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Revenue Distribution</h4>
              <p className="text-sm text-blue-700">Top customer contributes 46% of total revenue. Focus on retaining high-value customers.</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Loyalty Program</h4>
              <p className="text-sm text-green-700">Silver tier has the highest membership. Consider upgrading incentives for Gold/Platinum.</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2">Conversion Opportunity</h4>
              <p className="text-sm text-red-700">28.6% cart abandonment rate. Implement retargeting campaigns to recover lost sales.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalyticsDashboard;