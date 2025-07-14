// import React from 'react';
// import { useNavigate } from 'react-router-dom'; // ✅ import

// const revenueData = [
//   { category: 'Beauty', revenue: 42000 },
//   { category: 'Home', revenue: 68000 },
//   { category: 'Clothing', revenue: 85000 },
//   { category: 'Sports & Outdoors', revenue: 39000 },
//   { category: 'Food', revenue: 73000 },
//   { category: 'Jewelry', revenue: 26000 },
//   { category: 'Personal Care', revenue: 31000 },
//   { category: 'Patio & Garden', revenue: 50000 },
//   { category: 'Health and Medicine', revenue: 45000 },
//   { category: 'Pets', revenue: 34000 },
//   { category: 'Premium Beauty', revenue: 37000 },
//   { category: 'Baby', revenue: 29000 },
//   { category: 'Household Essentials', revenue: 61000 },
//   { category: 'Home Improvement', revenue: 55000 },
//   { category: 'Shop with Purpose', revenue: 18000 },
//   { category: 'Party & Occasions', revenue: 20000 },
//   { category: 'Electronics', revenue: 120000 },
//   { category: 'Collectibles', revenue: 15000 },
//   { category: 'Arts Crafts & Sewing', revenue: 33000 },
//   { category: 'Subscriptions', revenue: 22000 },
//   { category: 'Toys', revenue: 39000 },
//   { category: 'Seasonal', revenue: 25000 },
//   { category: 'Auto & Tires', revenue: 48000 },
// ];

// const Products = () => {
//   const navigate = useNavigate(); // ✅ hook

//   return (
//     <div className="min-h-screen px-8 py-10">
//       <h2 className="text-4xl font-bold text-gray-800 mb-8">Product Categories</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {revenueData.map((item, index) => (
//           <div
//             key={index}
//             onClick={() => navigate(`/products/${encodeURIComponent(item.category)}`)} 
//             className="flex items-center bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-transform duration-200 hover:scale-[1.02] overflow-hidden cursor-pointer"
//           >
//             <div className="w-2 h-full bg-gradient-to-b from-blue-400 to-blue-600" />
//             <div className="p-6 flex flex-col justify-center">
//               <h3 className="text-xl font-semibold text-gray-800">{item.category}</h3>
//               <p className="text-sm text-gray-500 mt-1">
//                 Estimated Revenue: <span className="text-blue-600 font-bold">₹{item.revenue.toLocaleString()}</span>
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Products;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/v1/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();

        // Aggregate revenue by root_category_name
        const revenueByCategory = data.reduce((acc, product) => {
          const category = product.category.root_category_name;
          const revenue = parseFloat(product.final_price) * product.stock_quantity;
          acc[category] = (acc[category] || 0) + revenue;
          return acc;
        }, {});

        // Convert to array format for rendering
        const revenueData = Object.entries(revenueByCategory).map(([category, revenue]) => ({
          category,
          revenue: Math.round(revenue),
        }));

        setCategories(revenueData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen px-8 py-10">
      <h2 className="text-4xl font-bold text-gray-800 mb-8">Product Categories</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(`/products/${encodeURIComponent(item.category)}`)}
            className="flex items-center bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-transform duration-200 hover:scale-[1.02] overflow-hidden cursor-pointer"
          >
            <div className="w-2 h-full bg-gradient-to-b from-blue-400 to-blue-600" />
            <div className="p-6 flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-gray-800">{item.category}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Estimated Revenue:{' '}
                <span className="text-blue-600 font-bold">
                  ${item.revenue.toLocaleString('en-US')}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;