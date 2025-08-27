import React, { useState, useEffect } from 'react';
import { getTop15Makes, getTotalCount } from '../utils/dataFunctions';

const SimpleChart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topMakes, setTopMakes] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      
      // Load top 15 makes
      const makes = await getTop15Makes(setLoading);
      setTopMakes(makes);
      
      // Load total count
      const count = await getTotalCount(setLoading);
      setTotalCount(count);
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Top 15 Vehicle Makes
          </h1>
          <p className="text-gray-600">
            Total vehicles: {totalCount.toLocaleString()}
          </p>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            {topMakes.map((make, index) => (
              <div key={make.name} className="flex items-center">
                <div className="flex items-center w-1/3">
                  <span className="text-sm font-medium text-gray-500 w-6">
                    {index + 1}.
                  </span>
                  <span className="text-sm text-gray-900">{make.name}</span>
                </div>
                <div className="flex items-center flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3 mr-4">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${(make.count / topMakes[0].count) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16 text-right">
                    {make.count.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleChart;
