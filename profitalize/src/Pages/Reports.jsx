import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Users, TrendingUp, ShoppingCart, Target, Gift, AlertCircle, Star, DollarSign, Activity, UserCheck } from 'lucide-react';

const CRMDashboard = () => {
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Sample data based on your database
  const customerTransactions = [
    { customer_id: 1, name: "John Doe", total_spending: 1149.00, loyalty_tier: "Gold", visits: 25, last_login: "2024-07-01" },
    { customer_id: 3, name: "Mike Johnson", total_spending: 809.99, loyalty_tier: "Bronze", visits: 8, last_login: "2024-06-25" },
    { customer_id: 5, name: "David Brown", total_spending: 341.99, loyalty_tier: "Platinum", visits: 32, last_login: "2024-07-05" },
    { customer_id: 4, name: "Sarah Williams", total_spending: 130.00, loyalty_tier: "Platinum", visits: 32, last_login: "2024-07-02" },
    { customer_id: 2, name: "Jane Smith", total_spending: 19.47, loyalty_tier: "Silver", visits: 15, last_login: "2024-06-28" }
  ];

  const loyaltyTiers = [
    { loyalty_tier: "Gold", count: 1, color: "#FFD700" },
    { loyalty_tier: "Silver", count: 2, color: "#C0C0C0" },
    { loyalty_tier: "Platinum", count: 1, color: "#E5E4E2" },
    { loyalty_tier: "Bronze", count: 1, color: "#CD7F32" }
  ];

  const cartAnalysis = [
    { stage: "Cart Initiated", count: 7, conversion_rate: 71.4 },
    { stage: "Purchase Completed", count: 5, conversion_rate: 100 }
  ];

  const dealUsageByTier = [
    { loyalty_tier: "Gold", electronics_deal: 1, beauty_deal: 0, home_deal: 0, total_savings: 50 },
    { loyalty_tier: "Silver", electronics_deal: 0, beauty_deal: 1, home_deal: 0, total_savings: 3.43 },
    { loyalty_tier: "Bronze", electronics_deal: 1, beauty_deal: 0, home_deal: 0, total_savings: 50 },
    { loyalty_tier: "Platinum", electronics_deal: 0, beauty_deal: 0, home_deal: 1, total_savings: 38 }
  ];

  const customerSegmentation = [
    { segment: "High Value", customers: 2, avg_spending: 979.50, retention_rate: 95 },
    { segment: "Medium Value", customers: 2, avg_spending: 235.99, retention_rate: 80 },
    { segment: "Low Value", customers: 1, avg_spending: 19.47, retention_rate: 60 }
  ];

  const customerLifecycle = [
    { stage: "New", count: 1, percentage: 20 },
    { stage: "Active", count: 2, percentage: 40 },
    { stage: "Engaged", count: 1, percentage: 20 },
    { stage: "At Risk", count: 1, percentage: 20 }
  ];

  const engagementMetrics = [
    { metric: "Email Open Rate", value: 68, target: 70, status: "warning" },
    { metric: "Click-through Rate", value: 12, target: 15, status: "danger" },
    { metric: "Customer Satisfaction", value: 4.2, target: 4.5, status: "warning" },
    { metric: "Net Promoter Score", value: 45, target: 50, status: "warning" }
  ];

  const revenueByTier = loyaltyTiers.map(tier => {
    const customers = customerTransactions.filter(c => c.loyalty_tier === tier.loyalty_tier);
    const totalRevenue = customers.reduce((sum, c) => sum + c.total_spending, 0);
    return {
      tier: tier.loyalty_tier,
      revenue: totalRevenue,
      customers: customers.length,
      avgSpending: customers.length > 0 ? totalRevenue / customers.length : 0,
      color: tier.color
    };
  });

  const riskAnalysis = customerTransactions.map(customer => {
    const daysSinceLogin = Math.floor((new Date() - new Date(customer.last_login)) / (1000 * 60 * 60 * 24));
    let riskLevel = 'Low';
    if (daysSinceLogin > 30) riskLevel = 'High';
    else if (daysSinceLogin > 14) riskLevel = 'Medium';
    
    return {
      ...customer,
      daysSinceLogin,
      riskLevel,
      clv: customer.total_spending * (customer.visits / 10) // Simplified CLV calculation
    };
  });

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0066'];

  const MetricCard = ({ icon: Icon, title, value, change, changeType, color = "blue" }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {change && (
            <p className={`text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'positive' ? '↑' : '↓'} {change}
            </p>
          )}
        </div>
        <Icon className={`w-8 h-8 text-${color}-500`} />
      </div>
    </div>
  );

  const RiskIndicator = ({ level }) => {
    const colors = {
      Low: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      High: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level]}`}>
        {level} Risk
      </span>
    );
  };

  const totalCustomers = customerTransactions.length;
  const totalRevenue = customerTransactions.reduce((sum, c) => sum + c.total_spending, 0);
  const avgOrderValue = totalRevenue / totalCustomers;
  const cartAbandonmentRate = ((cartAnalysis[0].count - cartAnalysis[1].count) / cartAnalysis[0].count * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Navigation */}
        <div className="mb-6">
          <div className="flex space-x-4 bg-white p-2 rounded-lg shadow-sm">
            {['overview', 'segmentation', 'lifecycle', 'engagement'].map(metric => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-4 py-2 rounded-md capitalize transition-colors ${
                  selectedMetric === metric
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {metric}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {selectedMetric === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Spending Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Customer Spending Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={customerTransactions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Total Spending']} />
                  <Bar dataKey="total_spending" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Loyalty Tier Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Loyalty Tier Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={loyaltyTiers}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ loyalty_tier, count }) => `${loyalty_tier}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {loyaltyTiers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue by Loyalty Tier */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Revenue by Loyalty Tier</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByTier}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tier" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Deal Usage Analysis */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Deal Usage by Loyalty Tier</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dealUsageByTier}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="loyalty_tier" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total_savings" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedMetric === 'segmentation' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Segmentation */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Customer Segmentation</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={customerSegmentation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="segment" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="customers" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Average Spending by Segment */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Average Spending by Segment</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={customerSegmentation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="segment" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Avg Spending']} />
                  <Bar dataKey="avg_spending" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Retention Rate by Segment */}
            <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Retention Rate by Segment</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={customerSegmentation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="segment" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Retention Rate']} />
                  <Area type="monotone" dataKey="retention_rate" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedMetric === 'lifecycle' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Lifecycle Stages */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Customer Lifecycle Stages</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={customerLifecycle}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ stage, percentage }) => `${stage}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {customerLifecycle.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Cart Conversion Analysis */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Cart Conversion Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cartAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ff7300" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Customer Journey Timeline */}
            <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Customer Activity Timeline</h3>
              <div className="space-y-4">
                {customerTransactions.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-600">{customer.visits} visits • Last login: {customer.last_login}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${customer.total_spending}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customer.loyalty_tier === 'Platinum' ? 'bg-gray-100 text-gray-800' :
                        customer.loyalty_tier === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                        customer.loyalty_tier === 'Silver' ? 'bg-gray-100 text-gray-600' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {customer.loyalty_tier}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedMetric === 'engagement' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement Metrics */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
              <div className="space-y-4">
                {engagementMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{metric.metric}</p>
                      <p className="text-sm text-gray-600">Target: {metric.target}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <div className={`w-2 h-2 rounded-full ${
                        metric.status === 'success' ? 'bg-green-500' :
                        metric.status === 'warning' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Engagement Radar */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Engagement Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={engagementMetrics}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Current" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Target" dataKey="target" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Customer Visits Analysis */}
            <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Customer Visit Frequency</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={customerTransactions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visits" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CRMDashboard;