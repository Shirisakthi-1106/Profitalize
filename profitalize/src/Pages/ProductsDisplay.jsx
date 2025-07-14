import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEllipsisV, FaEye, FaEdit, FaTrash, FaTimes, FaArrowLeft, FaStar, FaBox, FaShippingFast, FaCalendarAlt, FaTag, FaPalette } from 'react-icons/fa';

const ProductDisplay = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/v1/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();

        // Filter and map products by root_category_name
        const filteredProducts = data
          .filter((product) => product.category.root_category_name === decodeURIComponent(category))
          .map((product) => ({
            id: product.product_id,
            name: product.product_name,
            price: `$${parseFloat(product.final_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            details: product,
          }));

        setProducts(filteredProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => (prev === id ? null : id));
  };

  const handleAction = (action, id) => {
    if (action === 'View Details') {
      const product = products.find((p) => p.id === id);
      setSelectedProduct(product.details);
    } else {
      alert(`${action} clicked for Product ID: ${id}`);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setDropdownOpen(null); // Close dropdown when modal closes
  };

  const returnToCategories = () => {
    navigate('/products');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen px-8 py-10 bg-gray-50">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-800">
          Products in <span className="text-blue-600">{decodeURIComponent(category)}</span>
        </h2>
        <button
          onClick={returnToCategories}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaArrowLeft />
          Back to Categories
        </button>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500 text-lg">No products found for this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-transform duration-200 hover:scale-[1.02] relative"
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
                      <div className="absolute right-0 top-8 bg-white border border-gray-200 shadow-md rounded-md z-20 w-40">
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
      )}

      {/* Enhanced Modal for Product Details */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <FaTimes size={24} />
              </button>
              <h3 className="text-2xl font-bold pr-10">{selectedProduct.product_name}</h3>
              <p className="text-blue-100 mt-1">{selectedProduct.brand}</p>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Image and Quick Stats */}
                <div>
                  <div className="mb-6">
                    <img
                      src={selectedProduct.main_image}
                      alt={selectedProduct.product_name}
                      className="w-full h-80 object-cover rounded-xl shadow-md"
                    />
                  </div>
                  
                  {/* Quick Stats Cards */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-green-700">
                        <FaStar />
                        <span className="font-semibold">Rating</span>
                      </div>
                      <p className="text-xl font-bold text-green-800 mt-1">
                        {selectedProduct.rating_stars} ⭐
                      </p>
                      <p className="text-sm text-green-600">
                        {selectedProduct.review_count} reviews
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 text-blue-700">
                        <FaShippingFast />
                        <span className="font-semibold">Delivery</span>
                      </div>
                      <p className="text-xl font-bold text-blue-800 mt-1">
                        {selectedProduct.estimated_delivery_days} days
                      </p>
                      <p className="text-sm text-blue-600">
                        ${parseFloat(selectedProduct.shipping_cost).toFixed(2)} shipping
                      </p>
                    </div>
                  </div>

                  {/* Price Card */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                    <h4 className="text-lg font-semibold text-purple-800 mb-3">Pricing</h4>
                    <div className="text-3xl font-bold text-purple-900 mb-2">
                      ${parseFloat(selectedProduct.final_price).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-purple-700">
                      <span className="flex items-center gap-1">
                        <FaBox />
                        Stock: {selectedProduct.stock_quantity}
                      </span>
                      <span className="flex items-center gap-1">
                        {selectedProduct.free_returns ? '✅ Free Returns' : '❌ No Returns'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Detailed Information */}
                <div className="space-y-6">
                  {/* Description */}
                  <div className="bg-gray-50 p-5 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Description</h4>
                    <p className="text-gray-700 leading-relaxed">{selectedProduct.description}</p>
                  </div>

                  {/* Category Info */}
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl border border-indigo-200">
                    <h4 className="text-lg font-semibold text-indigo-800 mb-3">Category</h4>
                    <p className="text-indigo-700">
                      <span className="font-medium">{selectedProduct.category.category_name}</span>
                      <span className="text-indigo-500"> • {selectedProduct.category.root_category_name}</span>
                    </p>
                  </div>

                  {/* Colors and Tags */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-5 rounded-xl border border-pink-200">
                      <h4 className="text-lg font-semibold text-pink-800 mb-3 flex items-center gap-2">
                        <FaPalette />
                        Colors
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {JSON.parse(selectedProduct.colors || '[]').map((color, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-pink-200 text-pink-800 rounded-full text-sm"
                          >
                            {color}
                          </span>
                        )) || <span className="text-pink-600">No colors available</span>}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border border-orange-200">
                      <h4 className="text-lg font-semibold text-orange-800 mb-3 flex items-center gap-2">
                        <FaTag />
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {JSON.parse(selectedProduct.tags || '[]').map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        )) || <span className="text-orange-600">No tags available</span>}
                      </div>
                    </div>
                  </div>

                  {/* Specifications */}
                  {selectedProduct.specifications && Object.keys(JSON.parse(selectedProduct.specifications)).length > 0 && (
                    <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-5 rounded-xl border border-teal-200">
                      <h4 className="text-lg font-semibold text-teal-800 mb-3">Specifications</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(JSON.parse(selectedProduct.specifications)).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-teal-700 font-medium">{key}:</span>
                            <span className="text-teal-600">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Details */}
                  <div className="bg-gray-50 p-5 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Additional Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Unit:</span>
                        <span className="text-gray-800 font-medium">{selectedProduct.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">UPC:</span>
                        <span className="text-gray-800 font-medium">{selectedProduct.upc}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ingredients:</span>
                        <span className="text-gray-800 font-medium">{selectedProduct.ingredients || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">
                          <FaCalendarAlt />
                          Created:
                        </span>
                        <span className="text-gray-800 font-medium">
                          {new Date(selectedProduct.created_date).toLocaleDateString('en-US')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
              <button
                onClick={returnToCategories}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FaArrowLeft />
                Back to Categories
              </button>
              <button
                onClick={closeModal}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDisplay;