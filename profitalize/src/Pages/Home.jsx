import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const revenueData = [
  { category: 'Beauty', revenue: 42000 },
  { category: 'Home', revenue: 68000 },
  { category: 'Clothing', revenue: 85000 },
  { category: 'Sports & Outdoors', revenue: 39000 },
  { category: 'Food', revenue: 73000 },
  { category: 'Jewelry', revenue: 26000 },
  { category: 'Personal Care', revenue: 31000 },
  { category: 'Patio & Garden', revenue: 50000 },
  { category: 'Health and Medicine', revenue: 45000 },
  { category: 'Pets', revenue: 34000 },
  { category: 'Premium Beauty', revenue: 37000 },
  { category: 'Baby', revenue: 29000 },
  { category: 'Household Essentials', revenue: 61000 },
  { category: 'Home Improvement', revenue: 55000 },
  { category: 'Shop with Purpose', revenue: 18000 },
  { category: 'Party & Occasions', revenue: 20000 },
  { category: 'Electronics', revenue: 120000 },
  { category: 'Collectibles', revenue: 15000 },
  { category: 'Arts Crafts & Sewing', revenue: 33000 },
  { category: 'Subscriptions', revenue: 22000 },
  { category: 'Toys', revenue: 39000 },
  { category: 'Seasonal', revenue: 25000 },
  { category: 'Auto & Tires', revenue: 48000 },
];

// === Customer Count Data ===
const dataByView = {
  year: [
    { month: 'Jan', customers: 1200 },
    { month: 'Feb', customers: 1450 },
    { month: 'Mar', customers: 1780 },
    { month: 'Apr', customers: 2100 },
    { month: 'May', customers: 2000 },
    { month: 'Jun', customers: 2200 },
    { month: 'Jul', customers: 2400 },
    { month: 'Aug', customers: 2300 },
    { month: 'Sep', customers: 2500 },
    { month: 'Oct', customers: 2650 },
    { month: 'Nov', customers: 2700 },
    { month: 'Dec', customers: 2900 },
  ],
  month: [
    { week: 'Week 1', customers: 400 },
    { week: 'Week 2', customers: 500 },
    { week: 'Week 3', customers: 550 },
    { week: 'Week 4', customers: 600 },
  ],
  week: [
    { day: 'Mon', customers: 70 },
    { day: 'Tue', customers: 85 },
    { day: 'Wed', customers: 90 },
    { day: 'Thu', customers: 75 },
    { day: 'Fri', customers: 95 },
    { day: 'Sat', customers: 110 },
    { day: 'Sun', customers: 100 },
  ],
};

const cards = [
  { title: "Total Products", value: "1,278" },
  { title: "Total Revenue", value: "₹12.4M" },
  { title: "Active Deals", value: "36" },
  { title: "Top Category", value: "Electronics" },
  { title: "Avg Ratings", value: "4.5 ★" }
];


const Home = () => {
  const [view, setView] = useState('year');
  const chartData = dataByView[view];
  const xKey = view === 'year' ? 'month' : view === 'month' ? 'week' : 'day';

  const handleChange = (e) => {
    setView(e.target.value);
  };

  return (
    <div className="min-h-screen py-10">
      <div className="relative px-8 py-12 mb-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl mx-8 shadow-2xl overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-400/20 to-transparent rounded-full blur-2xl transform -translate-x-16 translate-y-16"></div>
        
        {/* Content */}
        <div className="flex flex-col items-center justify-center text-center relative z-10">
          <h1 className='text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-sm'>
            Analytics Dashboard
          </h1>
          <p className="text-2xl text-blue-50/90 mb-2 max-w-3xl leading-relaxed">
            Track your business performance, monitor key metrics, and gain insights with real-time data visualization.
          </p>
        </div>
      </div>

      <div className="flex justify-between gap-6 w-full px-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex-1 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-6 text-center border border-gray-100 hover:border-gray-200"
          >
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-3">
              {card.title}
            </h3>
            <p className="text-3xl font-bold text-blue-600 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* === Customer Count Chart === */}
      <div className="w-full px-8 pt-10">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="inline-block w-1 h-6 bg-blue-400 rounded-sm"></span>
            Customer Count over <span className="text-blue-500">Time</span>
          </h2>
            <select
              value={view}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-1 text-sm text-gray-700"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip formatter={(value) => `${value} customers`} />
                <Line
                  type="monotone"
                  dataKey="customers"
                  stroke="#4DBDF5"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* === Revenue Chart === */}
      <div className="w-full px-8 mb-10 pt-10">

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="inline-block w-1 h-6 bg-blue-400 rounded-sm"></span>
          Revenue by <span className="text-blue-500">Category</span>
        </h2>
          <div className="w-full h-[700px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  dataKey="category"
                  type="category"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  width={140}
                />
                <Tooltip
                  formatter={(value) => `₹${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="#4DBDF5"
                  name="Revenue (₹)"
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      

      

    </div>
  );
};

export default Home;