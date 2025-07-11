// DragDropSimulator.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  ShoppingBag, Smartphone, Laptop, Car, Home, Utensils, Book, Gamepad2,
  Dumbbell, Plane, Music, Brush, Baby, Flower, Wrench, X, Plus
} from 'lucide-react';

// --- Right Panel Component ---
const RightPanel = ({ stageBlocks, connections, profitData, aiSuggestions }) => {
  const [width, setWidth] = useState(320);
  const isResizing = useRef(false);

  const handleMouseDown = () => { isResizing.current = true; };
  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= 240 && newWidth <= 600) {
      setWidth(newWidth);
    }
  };
  const handleMouseUp = () => { isResizing.current = false; };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      <div
        className="w-1 bg-gray-400 cursor-col-resize hover:bg-gray-600 transition"
        onMouseDown={handleMouseDown}
        style={{ zIndex: 50 }}
      />
      <div
        className="p-4 overflow-y-auto"
        style={{
          width: `${width}px`,
          backgroundColor: "#dff24f",
          transition: "width 0.2s ease",
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: "#070807" }}>Analytics</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3" style={{ color: "#070807" }}>
            Profit by Product
          </h3>
          <div className="h-64 rounded-lg p-2" style={{ backgroundColor: "#f4f4f4" }}>
            {profitData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f6ec" />
                  <XAxis dataKey="name" fontSize={11} tick={{ fill: "#070807" }} axisLine={{ stroke: "#070807" }} />
                  <YAxis fontSize={11} tick={{ fill: "#070807" }} axisLine={{ stroke: "#070807" }} />
                  <Tooltip contentStyle={{
                    backgroundColor: "#070807",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#dff24f"
                  }} labelStyle={{ color: "#dff24f" }} />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#5fc3ab"
                    strokeWidth={3}
                    dot={{ fill: "#5fc3ab", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#dff24f" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-700">No data to show</p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Flow Stats</h3>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Products:</span>
              <span className="font-medium text-blue-600">{stageBlocks.filter(b => b.type === "product").length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Deals:</span>
              <span className="font-medium text-green-600">{stageBlocks.filter(b => b.type === "deal").length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Connections:</span>
              <span className="font-medium text-purple-600">{connections.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg Boost:</span>
              <span className="font-medium text-orange-600">
                {profitData.length > 0
                  ? `${(profitData.reduce((sum, p) => sum + parseFloat(p.boost), 0) / profitData.length).toFixed(1)}x`
                  : "1.0x"}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700 flex items-center gap-2">
            AI Suggestions
          </h3>
          <div className="space-y-2">
            {aiSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 hover:bg-yellow-100 transition-colors"
              >
                <p className="text-xs text-yellow-800 leading-relaxed">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RightPanel;
