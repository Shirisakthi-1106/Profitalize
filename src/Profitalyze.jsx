import React, { useState, useEffect } from 'react';
import ProfitSimulator from './ProfitSimulator';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Users, ShoppingCart, Target } from 'lucide-react';
import Products from './pages/Products';

const Profitalyze = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [customerPeriod, setCustomerPeriod] = useState('monthly');

  const [stats, setStats] = useState({
    totalRevenue: 125680,
    totalProfit: 45230,
    customerCount: 1250,
    avgOrderValue: 89.5,
    conversionRate: 3.2,
  });

  const salesData = [
    { month: 'Jan', sales: 12500, profit: 4200 },
    { month: 'Feb', sales: 15800, profit: 5300 },
    { month: 'Mar', sales: 18200, profit: 6100 },
    { month: 'Apr', sales: 22100, profit: 7400 },
    { month: 'May', sales: 19500, profit: 6500 },
    { month: 'Jun', sales: 25600, profit: 8600 },
  ];

  const customerData = {
    weekly: [
      { period: 'Week 1', customers: 45 },
      { period: 'Week 2', customers: 52 },
      { period: 'Week 3', customers: 48 },
      { period: 'Week 4', customers: 61 },
    ],
    monthly: [
      { period: 'Jan', customers: 180 },
      { period: 'Feb', customers: 220 },
      { period: 'Mar', customers: 195 },
      { period: 'Apr', customers: 280 },
      { period: 'May', customers: 245 },
      { period: 'Jun', customers: 200 },
    ],
    yearly: [
      { period: '2021', customers: 1800 },
      { period: '2022', customers: 2400 },
      { period: '2023', customers: 2800 },
      { period: '2024', customers: 3200 },
    ],
  };

  const StatCard = ({ title, value, change, icon: Icon }) => (
    <div className="flex flex-col rounded-lg overflow-hidden shadow-md">
      <div className="bg-black text-white p-4 border border-gray-700 flex items-center gap-3">
        <Icon className="w-6 h-6 text-white" />
        <div>
          <p className="text-lg font-semibold">{value}</p>
          <p className="text-sm text-gray-400">{title}</p>
        </div>
      </div>
      {change !== undefined && (
        <div className="bg-[#dff24f] px-3 py-2 flex justify-center">
          <div className="bg-[#5fc3ab] text-black text-sm font-medium px-3 py-1 rounded-full shadow-sm">
            {change >= 0 ? '+' : ''}
            {change}% from last month
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (currentPage === 'home') {
      return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} />
            <StatCard title="Total Profit" value={`$${stats.totalProfit.toLocaleString()}`} change={8.2} icon={Target} />
            <StatCard title="Customers" value={stats.customerCount.toLocaleString()} change={15.3} icon={Users} />
            <StatCard title="Avg Order Value" value={`$${stats.avgOrderValue.toFixed(2)}`} change={-2.1} icon={ShoppingCart} />
            <StatCard title="Conversion Rate" value={`${stats.conversionRate}%`} change={5.7} icon={TrendingUp} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#dff24f] rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip cursor={{ fill: '#d1ece3' }} />
                  <Legend />
                  <Bar dataKey="sales" fill="#000000" name="Sales" />
                  <Bar dataKey="profit" fill="#10B981" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Customer Count</h3>
                <select
                  value={customerPeriod}
                  onChange={(e) => setCustomerPeriod(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={customerData[customerPeriod]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value.toLocaleString(), 'Customers']} />
                  <Line type="monotone" dataKey="customers" stroke="#5fc3ab" strokeWidth={3} dot={{ fill: '#5fc3ab', strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
    }

    if (currentPage === 'insights') return <ProfitSimulator />;
    if (currentPage === 'products') return <Products />;

    return (
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</h2>
        <p className="text-gray-600">Content for {currentPage} page will be implemented here.</p>
      </div>
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 100),
        customerCount: prev.customerCount + Math.floor(Math.random() * 5),
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-50 bg-black shadow-sm border-b border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Profitalyze</h1>
            </div>
            <div className="hidden md:flex md:space-x-8 items-center">
              {['home', 'products', 'insights', 'analytics', 'reports'].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-24 text-center px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    currentPage === page ? 'text-black bg-[#dff24f]' : 'text-white hover:text-black hover:bg-[#dff24f]'
                  }`}
                >
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Profitalyze;
