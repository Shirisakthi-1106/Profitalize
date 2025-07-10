import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaEllipsisV, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const sampleProducts = {
  Beauty: [
    { id: 1, name: 'Lipstick', price: '₹799' },
    { id: 2, name: 'Foundation', price: '₹1199' },
  ],
  Electronics: [
    { id: 3, name: 'Smartphone', price: '₹23,999' },
    { id: 4, name: 'Laptop', price: '₹65,000' },
  ],
  Clothing: [
    { id: 5, name: 'T-Shirt', price: '₹499' },
    { id: 6, name: 'Jeans', price: '₹1,299' },
  ],
};

const ProductDisplay = () => {
  const { category } = useParams();
  const products = sampleProducts[category] || [];
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => (prev === id ? null : id));
  };

  const handleAction = (action, id) => {
    alert(`${action} clicked for Product ID: ${id}`);
  };

  return (
    <div className="min-h-screen px-8 py-10 bg-gray-50">
      <h2 className="text-4xl font-bold text-gray-800 mb-8">
        Products in <span className="text-blue-600">{category}</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-transform duration-200 hover:scale-[1.02] overflow-hidden relative"
          >
            <div className="w-2 h-full bg-gradient-to-b from-blue-400 to-blue-600" />

            <div className="p-6 flex flex-col justify-center w-full">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Price: <span className="font-medium">{product.price}</span>
                  </p>
                </div>

                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(product.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaEllipsisV />
                  </button>

                  {dropdownOpen === product.id && (
                    <div className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-md rounded-md z-10 w-40">
                      <ul className="text-sm text-gray-700">
                        <li
                          className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleAction('View Details', product.id)}
                        >
                          <FaEye /> View Details
                        </li>
                        <li
                          className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleAction('Edit', product.id)}
                        >
                          <FaEdit /> Edit
                        </li>
                        <li
                          className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 text-red-500 cursor-pointer"
                          onClick={() => handleAction('Delete', product.id)}
                        >
                          <FaTrash /> Delete
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDisplay;
