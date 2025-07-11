//inge keezhe
// export default WalmartRetailSimulator;
import RightPanel from './RightPanel';

import React, { useState, useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShoppingBag, Smartphone, Laptop, Car, Home, Utensils, Book, Gamepad2, Dumbbell, Plane, Music, Brush, Baby, Flower, Wrench, X, Lightbulb, Plus } from 'lucide-react';

const DragDropSimulator = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [stageBlocks, setStageBlocks] = useState([]);
  const [connections, setConnections] = useState([]);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const [snapCandidate, setSnapCandidate] = useState(null);
  const stageRef = useRef(null);

  // Categories with icons and products
  const categories = [
    { id: 'fashion', name: 'Fashion', icon: ShoppingBag, products: ['Levi Jeans', 'Nike Shoes', 'Adidas Hoodie', 'Ray-Ban Sunglasses', 'Gucci Belt'] },
    { id: 'electronics', name: 'Electronics', icon: Smartphone, products: ['iPhone 15', 'Samsung Galaxy', 'AirPods Pro', 'iPad Air', 'MacBook Pro'] },
    { id: 'computers', name: 'Computers', icon: Laptop, products: ['Gaming PC', 'Dell Laptop', 'Mechanical Keyboard', 'Wireless Mouse', 'Monitor 4K'] },
    { id: 'automotive', name: 'Automotive', icon: Car, products: ['Car Tires', 'Motor Oil', 'GPS Navigator', 'Dash Cam', 'Car Charger'] },
    { id: 'home', name: 'Home & Garden', icon: Home, products: ['Smart Thermostat', 'Robot Vacuum', 'LED Bulbs', 'Garden Tools', 'Throw Pillows'] },
    { id: 'food', name: 'Food & Beverage', icon: Utensils, products: ['Protein Powder', 'Organic Tea', 'Gourmet Coffee', 'Energy Bars', 'Vitamins'] },
    { id: 'books', name: 'Books & Media', icon: Book, products: ['Business Books', 'Kindle Unlimited', 'Audiobooks', 'Notebooks', 'Magazines'] },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2, products: ['PS5 Console', 'Xbox Controller', 'Gaming Headset', 'VR Headset', 'Steam Deck'] },
    { id: 'fitness', name: 'Fitness', icon: Dumbbell, products: ['Yoga Mat', 'Dumbbells', 'Protein Shakes', 'Fitness Tracker', 'Resistance Bands'] },
    { id: 'travel', name: 'Travel', icon: Plane, products: ['Luggage Set', 'Travel Pillow', 'Passport Holder', 'Travel Adapter', 'Packing Cubes'] },
    { id: 'music', name: 'Music', icon: Music, products: ['Bluetooth Speaker', 'Vinyl Records', 'Guitar Picks', 'Music Streaming', 'Headphones'] },
    { id: 'art', name: 'Art & Crafts', icon: Brush, products: ['Art Supplies', 'Painting Canvas', 'Colored Pencils', 'Craft Kit', 'Sketchbook'] },
    { id: 'baby', name: 'Baby & Kids', icon: Baby, products: ['Baby Stroller', 'Diapers', 'Baby Formula', 'Toys', 'Kids Clothes'] },
    { id: 'beauty', name: 'Beauty', icon: Flower, products: ['Skincare Set', 'Makeup Kit', 'Perfume', 'Hair Care', 'Nail Polish'] },
    { id: 'tools', name: 'Tools', icon: Wrench, products: ['Drill Set', 'Hammer', 'Screwdriver Kit', 'Toolbox', 'Measuring Tape'] }
  ];

  // Deal blocks
  const deals = [
    { id: 'bogo', name: 'Buy 1 Get 1', color: 'bg-green-500', boost: 1.5 },
    { id: 'discount', name: '20% Off', color: 'bg-red-500', boost: 1.2 },
    { id: 'bundle', name: 'Bundle & Save', color: 'bg-blue-500', boost: 1.8 },
    { id: 'shipping', name: 'Free Shipping', color: 'bg-purple-500', boost: 1.1 },
    { id: 'flash', name: 'Flash Discount', color: 'bg-yellow-500', boost: 1.3 }
  ];

  // Calculate distance between two points
  const calculateDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  // Find snap candidate
  const findSnapCandidate = (x, y, draggedBlockType) => {
    const snapDistance = 80;
    let closest = null;
    let minDistance = Infinity;

    stageBlocks.forEach(block => {
      if (block.type === draggedBlockType) return;
      if (draggedBlockType === 'product' && block.type === 'deal') return;

      const distance = calculateDistance(x, y, block.x, block.y);
      if (distance < snapDistance && distance < minDistance) {
        minDistance = distance;
        closest = block;
      }
    });

    return closest;
  };

  // Calculate profit data based on connections
  const calculateProfitData = () => {
    const baseProfit = 800;
    const productBlocks = stageBlocks.filter(block => block.type === 'product');

    if (productBlocks.length === 0) return [];

    return productBlocks.map((product, index) => {
      const productConnections = connections.filter(conn => conn.productId === product.id);
      let boost = 1;

      productConnections.forEach(conn => {
        const connectedDeal = stageBlocks.find(b => b.id === conn.dealId);
        if (connectedDeal) {
          const dealInfo = deals.find(d => d.id === connectedDeal.originalId);
          if (dealInfo) boost *= dealInfo.boost;
        }
      });

      return {
        name: product.name.length > 8 ? product.name.substring(0, 8) + '...' : product.name,
        profit: Math.floor(baseProfit * boost + (Math.random() * 300 - 150)),
        connections: productConnections.length,
        boost: boost.toFixed(2)
      };
    });
  };

  // AI suggestions based on current setup
  const generateAISuggestions = () => {
    const suggestions = [];
    const productBlocks = stageBlocks.filter(block => block.type === 'product');
    const dealBlocks = stageBlocks.filter(block => block.type === 'deal');
    const unconnectedProducts = productBlocks.filter(p =>
      !connections.some(c => c.productId === p.id)
    );

    if (productBlocks.length === 0) {
      suggestions.push("blah blah blah");
      return suggestions;
    }

    if (dealBlocks.length === 0) {
      suggestions.push("Add promotional deals to boost conversion rates and revenue!");
    }

    if (unconnectedProducts.length > 0) {
      suggestions.push(`Connect deals to ${unconnectedProducts.length} unlinked product${unconnectedProducts.length > 1 ? 's' : ''} for better performance`);
    }

    if (connections.length > 0) {
      const avgConnections = connections.length / productBlocks.length;
      if (avgConnections < 1.5) {
        suggestions.push("Try stacking multiple deals on high-value products to maximize profit");
      }
    }

    if (productBlocks.length > 2 && dealBlocks.length > 0) {
      const hasBundleDeal = dealBlocks.some(deal => deal.originalId === 'bundle');
      if (!hasBundleDeal) {
        suggestions.push("Add 'Bundle & Save' deal for cross-selling opportunities");
      }
    }

    if (connections.length > 3) {
      suggestions.push("Great job! Your sales flow is optimized. Monitor the profit graph for performance.");
    }

    return suggestions.slice(0, 3);
  };

  // Handle drag start
  const handleDragStart = (e, block) => {
    setDraggedBlock(block);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();

    if (draggedBlock && stageRef.current) {
      const stageRect = stageRef.current.getBoundingClientRect();
      const x = e.clientX - stageRect.left - dragOffset.x;
      const y = e.clientY - stageRect.top - dragOffset.y;

      setDragPosition({ x, y });

      const candidate = findSnapCandidate(x, y, draggedBlock.type);
      setSnapCandidate(candidate);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedBlock || !stageRef.current) return;

    const stageRect = stageRef.current.getBoundingClientRect();
    let x = e.clientX - stageRect.left - dragOffset.x;
    let y = e.clientY - stageRect.top - dragOffset.y;

    if (snapCandidate) {
      if (draggedBlock.type === 'deal') {
        const connectedDeals = connections.filter(conn => conn.productId === snapCandidate.id);
        const dealOffset = connectedDeals.length * 70;
        x = snapCandidate.x;
        y = snapCandidate.y + 70 + dealOffset;
      }
    }

    const newBlock = {
      ...draggedBlock,
      id: `${draggedBlock.id}-${Date.now()}`,
      x: Math.max(0, Math.min(x, 600)),
      y: Math.max(0, Math.min(y, 1400)),
      originalId: draggedBlock.id
    };

    setStageBlocks(prev => [...prev, newBlock]);

    if (snapCandidate && draggedBlock.type === 'deal') {
      setConnections(prev => [...prev, {
        productId: snapCandidate.id,
        dealId: newBlock.id
      }]);
    }

    setDraggedBlock(null);
    setSnapCandidate(null);
  };

  // Remove block from stage
  const removeBlock = (blockId) => {
    setStageBlocks(prev => prev.filter(block => block.id !== blockId));
    setConnections(prev => prev.filter(conn =>
      conn.productId !== blockId && conn.dealId !== blockId
    ));
  };

  // Toggle connection between product and deal
  const toggleConnection = (productId, dealId) => {
    setConnections(prev => {
      const exists = prev.some(conn =>
        conn.productId === productId && conn.dealId === dealId
      );

      if (exists) {
        return prev.filter(conn =>
          !(conn.productId === productId && conn.dealId === dealId)
        );
      } else {
        const product = stageBlocks.find(b => b.id === productId);
        const deal = stageBlocks.find(b => b.id === dealId);

        if (product && deal) {
          const connectedDeals = prev.filter(conn => conn.productId === productId);
          const dealOffset = connectedDeals.length * 70;

          setStageBlocks(prevBlocks =>
            prevBlocks.map(block =>
              block.id === dealId
                ? { ...block, x: product.x, y: product.y + 70 + dealOffset }
                : block
            )
          );
        }

        return [...prev, { productId, dealId }];
      }
    });
  };

  // Render connection lines
  const renderConnections = () => {
    return connections.map((conn, index) => {
      const product = stageBlocks.find(b => b.id === conn.productId);
      const deal = stageBlocks.find(b => b.id === conn.dealId);

      if (!product || !deal) return null;

      const startX = product.x + 64;
      const startY = product.y + 64;
      const endX = deal.x + 64;
      const endY = deal.y;

      return (
        <svg
          key={index}
          className="absolute pointer-events-none"
          style={{ left: 0, top: 0, width: '100%', height: '100%' }}
        >
          <line
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke="#3B82F6"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <circle
            cx={startX}
            cy={startY}
            r="3"
            fill="#3B82F6"
          />
          <circle
            cx={endX}
            cy={endY}
            r="3"
            fill="#3B82F6"
          />
        </svg>
      );
    });
  };

  const profitData = calculateProfitData();
  const aiSuggestions = generateAISuggestions();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Left Panel - Categories */}
      <div className="w-1/10 border-r-2 p-4 overflow-y-auto" style={{ backgroundColor: '#070807' }}>
        {/* <h2 className="text-xl font-bold mb-4" style={{ color: '#f0f6ec' }}>Categories</h2> */}

        <div className="space-y-3">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory === category.id;

            return (
              <div
                key={category.id}
                className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200`}
                onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                title={category.name}
                style={{
                  backgroundColor: isSelected ? '#dff24f' : '#070807',
                  color: isSelected ? '#070807' : '#ffffff',
                  boxShadow: isSelected ? '0 0 10px #5fc3ab' : 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dff24f';
                  e.currentTarget.style.color = '#070807';
                  e.currentTarget.style.boxShadow = '0 0 10px #dff24f';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isSelected ? '#dff24f' : '#070807';
                  e.currentTarget.style.color = isSelected ? '#070807' : '#ffffff';
                  e.currentTarget.style.boxShadow = isSelected ? '0 0 10px #5fc3ab' : 'none';
                }}
              >
                <IconComponent size={20} />
              </div>
            );
          })}
        </div>
      </div>


      {/* Products & Deals Panel */}
      <div className="w-1/6 border-r-2 p-4 overflow-y-auto" style={{ backgroundColor: '#dff24f' }}>
        {/* Product Blocks */}
        {selectedCategory && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3" style={{ color: '#070807' }}>
              {categories.find(c => c.id === selectedCategory)?.name}
            </h3>
            <div className="space-y-2">
              {categories.find(c => c.id === selectedCategory)?.products.map((product, index) => (
                <div
                  key={`${selectedCategory}-${index}`}
                  className="rounded-lg p-2 cursor-move transition-colors"
                  style={{
                    backgroundColor: '#070807',
                    color: '#ffffff',
                    border: '2px solid #070807'
                  }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, {
                    id: `${selectedCategory}-${index}`,
                    name: product,
                    type: 'product',
                    category: selectedCategory
                  })}
                >
                  <div className="text-xs font-medium">{product}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deal Blocks */}
        <div>
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#070807' }}>Deals</h3>
          <div className="space-y-2">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="rounded-lg p-2 cursor-move hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: '#5fc3ab',
                  color: '#070807'
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, {
                  id: deal.id,
                  name: deal.name,
                  type: 'deal',
                  color: deal.color,
                  originalId: deal.id
                })}
              >
                <div className="text-xs font-medium">{deal.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Center Panel - Enhanced Stage */}
      <div className="w-3/5 p-4 overflow-hidden">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#070807' }}>building area</h2>
        <div className="h-full overflow-y-auto">
          <div
            ref={stageRef}
            className="rounded-lg border-2 border-dashed min-h-[1500px] p-4 relative"
            style={{ backgroundColor: '#f0f6ec', borderColor: '#cbd5e1' }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {stageBlocks.length === 0 && (
              <div className="text-center mt-20" style={{ color: '#6b7280' }}>
                <p className="text-lg">try dropping a product</p>
              </div>
            )}

            {renderConnections()}

            {stageBlocks.map((block) => {
              const isConnected = connections.some(conn =>
                conn.productId === block.id || conn.dealId === block.id
              );
              const isHovered = hoveredBlock === block.id;
              const isSnapTarget = snapCandidate?.id === block.id;

              return (
                <div
                  key={block.id}
                  className={`absolute w-32 h-16 p-2 rounded-lg border-2 transition-all cursor-pointer ${block.type === 'product'
                      ? `bg-[#ffffff] text-black border-[#070807] ${isConnected ? 'ring-2 ring-[#070807]' : ''
                      } ${isSnapTarget ? 'ring-4 ring-green-400 shadow-lg' : ''}`
                      : `bg-[#a3e0d3] text-black border-[#5fc3ab] ${isConnected ? 'ring-2 ring-[#5fc3ab]' : ''
                      }`
                    } ${isHovered ? 'scale-105' : ''}`}
                  style={{
                    left: `${block.x}px`,
                    top: `${block.y}px`,
                    zIndex: isSnapTarget ? 50 : (isHovered ? 20 : 10),
                  }}
                  onMouseEnter={() => setHoveredBlock(block.id)}
                  onMouseLeave={() => setHoveredBlock(null)}
                  onClick={() => {
                    if (block.type === 'product') {
                      const dealBlocks = stageBlocks.filter(b => b.type === 'deal');
                      const unconnectedDeals = dealBlocks.filter(deal =>
                        !connections.some(conn =>
                          conn.productId === block.id && conn.dealId === deal.id
                        )
                      );

                      if (unconnectedDeals.length > 0) {
                        const closest = unconnectedDeals.reduce((closest, deal) => {
                          const currentDistance = calculateDistance(block.x, block.y, deal.x, deal.y);
                          const closestDistance = calculateDistance(block.x, block.y, closest.x, closest.y);
                          return currentDistance < closestDistance ? deal : closest;
                        });

                        if (calculateDistance(block.x, block.y, closest.x, closest.y) < 300) {
                          toggleConnection(block.id, closest.id);
                        }
                      }
                    }
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBlock(block.id);
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                  >
                    <X size={10} />
                  </button>

                  <div className="text-xs font-medium">{block.name}</div>
                  <div className="text-xs opacity-80">{block.type === 'product' ? 'Product' : 'Deal'}</div>

                  {isConnected && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}

                  {block.type === 'product' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const nearbyDeals = stageBlocks.filter(b =>
                          b.type === 'deal' && calculateDistance(block.x, block.y, b.x, b.y) < 300
                        );
                        const unconnectedDeals = nearbyDeals.filter(deal =>
                          !connections.some(conn =>
                            conn.productId === block.id && conn.dealId === deal.id
                          )
                        );

                        if (unconnectedDeals.length > 0) {
                          const closest = unconnectedDeals.reduce((closest, deal) => {
                            const currentDistance = calculateDistance(block.x, block.y, deal.x, deal.y);
                            const closestDistance = calculateDistance(block.x, block.y, closest.x, closest.y);
                            return currentDistance < closestDistance ? deal : closest;
                          });
                          toggleConnection(block.id, closest.id);
                        }
                      }}
                      className="absolute -bottom-1 -left-1 w-4 h-4 bg-[#dff24f] text-black rounded-full flex items-center justify-center hover:bg-[#4cb29d] transition-colors"
                    >
                      <Plus size={8} />
                    </button>
                  )}
                </div>

              );
            })}

          </div>
        </div>
      </div>
                      <RightPanel
  stageBlocks={stageBlocks}
  connections={connections}
  profitData={profitData}
  aiSuggestions={aiSuggestions}
/>
    </div>);
}
export default DragDropSimulator;

