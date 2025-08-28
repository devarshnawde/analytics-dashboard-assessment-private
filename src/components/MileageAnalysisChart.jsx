import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Papa from 'papaparse';

const MileageAnalysisChart = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [yearFilter, setYearFilter] = useState('all'); // all, last5, last10
  const [availableYears, setAvailableYears] = useState([]);

  // Fetch and process CSV data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/data-to-visualize/Electric_Vehicle_Population_Data.csv');
        if (!response.ok) {
          throw new Error(`Failed to load CSV: ${response.statusText}`);
        }

        const csvText = await response.text();
        const result = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transform: (value) => value.trim()
        });

        // Process the data to extract mileage/range information
        const processedData = processCSVData(result.data);
        setData(processedData);
        setFilteredData(processedData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process CSV data to extract mileage/range information
  const processCSVData = (rawData) => {
    const processedData = rawData.map(item => {
      const electricRange = item['Electric Range'];
      const year = item['Model Year'];
      const make = item['Make'];
      
      return {
        electricRange: electricRange ? parseFloat(electricRange) : null,
        year: year ? parseInt(year) : null,
        make: make || 'Unknown'
      };
    }).filter(item => 
      item.electricRange && 
      item.electricRange > 0 && 
      item.year && 
      item.year >= 2010 && 
      item.year <= 2024 &&
      item.make !== 'Unknown'
    );

    // Extract unique years for filter
    const years = [...new Set(processedData.map(item => item.year))].sort((a, b) => a - b);
    setAvailableYears(years);

    return processedData;
  };

  // Apply year filter to data
  useEffect(() => {
    if (data.length === 0) return;

    setFilterLoading(true);

    const timer = setTimeout(() => {
      let filtered = data;
      
      if (yearFilter === 'last5') {
        const currentYear = new Date().getFullYear();
        filtered = data.filter(item => item.year >= currentYear - 5);
      } else if (yearFilter === 'last10') {
        const currentYear = new Date().getFullYear();
        filtered = data.filter(item => item.year >= currentYear - 10);
      }
      // 'all' keeps all data

      setFilteredData(filtered);
      setFilterLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [data, yearFilter]);

  // Generate mileage distribution data
  const getMileageDistribution = () => {
    if (!filteredData || filteredData.length === 0) return [];

    const ranges = [
      { min: 0, max: 100, label: '0-100 mi', color: '#ef4444' },
      { min: 100, max: 200, label: '100-200 mi', color: '#f97316' },
      { min: 200, max: 300, label: '200-300 mi', color: '#eab308' },
      { min: 300, max: 400, label: '300-400 mi', color: '#22c55e' },
      { min: 400, max: 500, label: '400-500 mi', color: '#3b82f6' },
      { min: 500, max: 1000, label: '500+ mi', color: '#8b5cf6' }
    ];

    return ranges.map(range => {
      const count = filteredData.filter(item => 
        item.electricRange >= range.min && item.electricRange < range.max
      ).length;
      
      return {
        ...range,
        count,
        percentage: ((count / filteredData.length) * 100).toFixed(1)
      };
    }).filter(item => item.count > 0);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-lg border border-gray-200 rounded-lg">
          <p className="font-semibold text-gray-900 mb-2">{data.label}</p>
          <p className="text-sm text-gray-600">Count: {data.count.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Percentage: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-gray-600">Loading mileage data...</span>
      </div>
    );
  }

  const chartData = getMileageDistribution();

  return (
    <div className="space-y-4">
      {/* Simple Year Filter */}
      <div className="flex gap-2 p-3 bg-gray-50 rounded-lg">
        {[
          { key: 'all', label: 'All Time' },
          { key: 'last10', label: 'Last 10 Years' },
          { key: 'last5', label: 'Last 5 Years' }
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setYearFilter(filter.key)}
            className={`px-4 py-2 text-sm rounded transition-colors ${
              yearFilter === filter.key
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Chart or Loading State */}
      {filterLoading ? (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
            <span className="text-sm text-gray-600">Updating chart...</span>
          </div>
        </div>
      ) : chartData && chartData.length > 0 ? (
        <div className="space-y-4">
          {/* Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis 
                dataKey="label" 
                stroke="#6b7280"
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                stroke="#6b7280"
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-gray-500">No data available</div>
            <div className="text-sm text-gray-400 mt-2">Try adjusting your filters</div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {!filterLoading && filteredData && filteredData.length > 0 && (
        <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">
              {filteredData.length.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total Vehicles</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">
              {Math.round(filteredData.reduce((sum, item) => sum + item.electricRange, 0) / filteredData.length)} mi
            </div>
            <div className="text-xs text-gray-600">Average Range</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">
              {Math.max(...filteredData.map(item => item.electricRange))} mi
            </div>
            <div className="text-xs text-gray-600">Max Range</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MileageAnalysisChart;
