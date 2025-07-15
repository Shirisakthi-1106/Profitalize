import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { X, TrendingUp, DollarSign, Percent, BarChart3 } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DealImpactModal = ({ isOpen, onClose, dealImpactData = [] }) => {
  if (!isOpen) return null;

  const totalRevenue = (dealImpactData || []).reduce((sum, deal) => sum + (parseFloat(deal?.total_revenue_with_deal || 0)), 0);
  const totalProfit = (dealImpactData || []).reduce((sum, deal) => sum + (parseFloat(deal?.profit_with_deal || 0)), 0);
  const totalIncrementalProfit = (dealImpactData || []).reduce((sum, deal) => sum + (parseFloat(deal?.incremental_profit || 0)), 0);
  const avgProfitMargin = dealImpactData.length > 0
    ? ((dealImpactData.reduce((sum, deal) => sum + (parseFloat(deal?.deal_profit_margin_percent || 0)), 0) / dealImpactData.length)).toFixed(1)
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b" style={{ backgroundColor: '#070807' }}>
          <div className="flex items-center gap-3">
            <BarChart3 size={24} style={{ color: '#dff24f' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#dff24f' }}>
              Deal Impact Analysis
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            style={{ color: '#dff24f' }}
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 bg-gray-50 border-b">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 size={16} className="text-blue-500" />
                <span className="text-sm font-medium text-gray-600">Total Deals</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{dealImpactData.length}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={16} className="text-green-500" />
                <span className="text-sm font-medium text-gray-600">Total Revenue</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-purple-500" />
                <span className="text-sm font-medium text-gray-600">Total Profit</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">${totalProfit.toFixed(2)}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
              <div className="flex items-center gap-2 mb-2">
                <Percent size={16} className="text-orange-500" />
                <span className="text-sm font-medium text-gray-600">Avg Profit Margin</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{avgProfitMargin}%</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className={totalIncrementalProfit >= 0 ? 'text-green-500' : 'text-red-500'} />
              <span className="text-sm font-medium text-gray-600">Total Incremental Profit</span>
            </div>
            <div className={`text-2xl font-bold ${totalIncrementalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalIncrementalProfit >= 0 ? '+' : ''}${totalIncrementalProfit.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr style={{ backgroundColor: '#070807', color: '#dff24f' }}>
                  <th className="p-3 text-left font-semibold">Deal Name</th>
                  <th className="p-3 text-left font-semibold">Type</th>
                  <th className="p-3 text-left font-semibold">Discount</th>
                  <th className="p-3 text-left font-semibold">Revenue</th>
                  <th className="p-3 text-left font-semibold">Profit</th>
                  <th className="p-3 text-left font-semibold">Margin (%)</th>
                  <th className="p-3 text-left font-semibold">Incremental Profit</th>
                </tr>
              </thead>
              <tbody>
                {(dealImpactData || []).map((deal, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-medium text-gray-900">{deal?.deal_name || 'N/A'}</td>
                    <td SambaClassName="p-3 text-gray-700">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                        {deal?.deal_type || 'N/A'}
                      </span>
                    </td>
                    <td className="p-3 text-gray-700">
                      <span className="font-medium">
                        {deal?.deal_type === 'percentage' ? `${deal?.discount_value || 0}%` : `$${deal?.discount_value || 0}`}
                      </span>
                    </td>
                    <td className="p-3 text-gray-700 font-medium">
                      ${parseFloat(deal?.total_revenue_with_deal || 0).toFixed(2)}
                    </td>
                    <td className="p-3 text-gray-700 font-medium">
                      ${parseFloat(deal?.profit_with_deal || 0).toFixed(2)}
                    </td>
                    <td className="p-3 text-gray-700 font-medium">
                      {(deal?.deal_profit_margin_percent || 0)}%
                    </td>
                    <td className="p-3 font-medium">
                      <span className={parseFloat(deal?.incremental_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {parseFloat(deal?.incremental_profit || 0) >= 0 ? '+' : ''}${parseFloat(deal?.incremental_profit || 0).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#070807' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RightPanel = ({ stageBlocks = [], connections = [], profitData = [], aiSuggestions = [], dealImpactData = [], predictedProfitMargin = null, predictionLoading = false, predictionError = null }) => {
  const [width, setWidth] = useState('20%');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isResizing = useRef(false);

  const handleMouseDown = () => {
    isResizing.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    const newWidth = ((window.innerWidth - e.clientX) / window.innerWidth) * 100;
    if (newWidth >= 15 && newWidth <= 40) setWidth(`${newWidth}%`);
  };

  const handleMouseUp = () => {
    isResizing.current = false;
  };

  useEffect(() => {
    window eventslist.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const getFlowStats = () => {
    const stats = stageBlocks.length === 0
      ? [
          { label: 'Total Deals', value: dealImpactData?.length || 0, color: 'text-blue-600' },
          { label: 'Total Revenue', value: `$${(dealImpactData || []).reduce((sum, deal) => sum + parseFloat(deal?.total_revenue_with_deal || 0), 0).toFixed(2)}`, color: 'text-green-600' },
          { label: 'Avg Profit Margin', value: `${dealImpactData?.length > 0 ? ((dealImpactData.reduce((sum, deal) => sum + parseFloat(deal?.deal_profit_margin_percent || 0), 0) / dealImpactData.length).toFixed(1)) : 0}%`, color: 'text-purple-600' },
        ]
      : [
          { label: 'Products', value: stageBlocks.filter(b => b?.type === 'product').length, color: 'text-blue-600' },
          { label: 'Deals', value: stageBlocks.filter(b => b?.type === 'deal').length, color: 'text-green-600' },
          { label: 'Connections', value: connections.length, color: 'text-purple-600' },
          { label: 'Avg Boost', value: profitData.length > 0 ? `${(profitData.reduce((sum, p) => sum + parseFloat(p?.boost || 0), 0) / profitData.length).toFixed(1)}x` : '1.0x', color: 'text-orange-600' },
        ];

    if (predictionLoading) {
      stats.push({ label: 'Predicted Margin', value: 'Loading...', color: 'text-gray-600' });
    } else if (predictionError) {
      stats.push({ label: 'Predicted Margin', value: 'Error', color: 'text-red-600' });
    } else if (predictedProfitMargin !== null) {
      stats.push({
        label: 'Predicted Margin',
        value: `${predictedProfitMargin.toFixed(2)}%`,
        color: predictedProfitMargin > 10 ? 'text-green-600' : 'text-red-600',
      });
    }

    return stats;
  };

  const flowStats = getFlowStats();

  // Prepare data for the stacked bar chart
  const marginData = useMemo(() => {
    const data = dealImpactData.map((deal, index) => {
      const totalMargin = parseFloat(deal?.deal_profit_margin_percent || 0);
      // Assume a 60% product, 40% deal contribution split (adjust if API provides specific data)
      const productContribution = totalMargin * 0.6;
      const dealContribution = totalMargin * 0.4;
      return {
        name: deal?.deal_name?.length > 8 ? deal.deal_name.substring(0, 8) + '...' : deal?.deal_name || `Deal ${index + 1}`,
        productMargin: productContribution,
        dealMargin: dealContribution,
        totalMargin,
      };
    });

    if (predictedProfitMargin !== null) {
      const productContribution = predictedProfitMargin * 0.6;
      const dealContribution = predictedProfitMargin * 0.4;
      data.push({
        name: 'Predicted',
        productMargin: productContribution,
        dealMargin: dealContribution,
        totalMargin: predictedProfitMargin,
      });
    }

    return data;
  }, [dealImpactData, predictedProfitMargin]);

  return (
    <>
      <div
        className="w-1 bg-gray-400 cursor-col-resize hover:bg-gray-600 transition"
        onMouseDown={handleMouseDown}
        style={{ zIndex: 50 }}
      />
      <div
        className="p-4 overflow-y-auto"
        style={{ width, backgroundColor: '#dff24f', transition: 'width 0.2s ease' }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#070807' }}>
          Analytics
        </h2>

        <div className="mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: '#070807', color: '#dff24f' }}
          >
            <BarChart3 size={18} />
            Deal Impact Analysis
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#070807' }}>
            Profit Margin Breakdown
          </h3>
          <div className="h-64 rounded-lg p-2" style={{ backgroundColor: '#f4f4f4' }}>
            {marginData.length > 0 ? (
              <Bar
                data={{
                  labels: marginData.map(d => d.name),
                  datasets: [
                    {
                      label: 'Product Contribution (%)',
                      data: marginData.map(d => d.productMargin),
                      backgroundColor: '#16a34a', // Green for products
                      borderColor: '#15803d',
                      borderWidth: 1,
                      stack: 'Stack 0', // Stack products and deals
                    },
                    {
                      label: 'Deal Contribution (%)',
                      data: marginData.map(d => d.dealMargin),
                      backgroundColor: '#2563eb', // Blue for deals
                      borderColor: '#1e40af',
                      borderWidth: 1,
                      stack: 'Stack 0', // Same stack group
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: 'Profit Margin (%)',
                        color: '#070807',
                      },
                      ticks: {
                        color: '#070807',
                      },
                    },
                    x: {
                      ticks: {
                        color: '#070807',
                        maxRotation: 45,
                        minRotation: 45,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                      labels: {
                        color: '#070807',
                        font: {
                          size: 12,
                        },
                      },
                    },
                    tooltip: {
                      backgroundColor: '#070807',
                      titleColor: '#dff24f',
                      bodyColor: '#dff24f',
                      callbacks: {
                        label: (context) => {
                          const datasetLabel = context.dataset.label || '';
                          const value = context.parsed.y;
                          return `${datasetLabel}: ${value.toFixed(2)}%`;
                        },
                      },
                    },
                  },
                  layout: {
                    padding: {
                      left: 10,
                      right: 10,
                      top: 10,
                      bottom: 10,
                    },
                  },
                }}
                height={256}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-700">No margin data to show</p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#070807' }}>
            Flow Stats
          </h3>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            {flowStats.map((stat, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{stat.label}:</span>
                <span className={`font-medium ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#070807' }}>
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

        <DealImpactModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          dealImpactData={dealImpactData}
        />
      </div>
    </>
  );
};

export default RightPanel;
