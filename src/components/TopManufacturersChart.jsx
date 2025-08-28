import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Papa from 'papaparse';

const TopManufacturersChart = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('All');
  const [vehicleType, setVehicleType] = useState('All');
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

        // Process the data to extract manufacturer, year, and vehicle type information
        const processedData = processCSVData(result.data);
        console.log('Processed data sample:', processedData.slice(0, 5));
        console.log('Total processed records:', processedData.length);
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

  // Process CSV data to extract manufacturer, year, and vehicle type information
  const processCSVData = (rawData) => {
    const processedData = rawData.map(item => {
      // Extract manufacturer, year, and vehicle type
      const make = item['Make'];
      const year = item['Model Year'];
      const evType = item['Electric Vehicle Type'];
      
      // Map the full vehicle type names to our filter options
      let mappedType = null;
      if (evType) {
        if (evType.includes('Battery Electric Vehicle') || evType.includes('BEV')) {
          mappedType = 'BEV';
        } else if (evType.includes('Plug-in Hybrid') || evType.includes('PHEV')) {
          mappedType = 'PHEV';
        }
      }
      
      return {
        make: make || 'Unknown',
        year: year ? parseInt(year) : null,
        evType: mappedType,
        originalItem: item
      };
    }).filter(item => item.make !== 'Unknown' && item.year && item.year >= 2010 && item.year <= 2024);

    // Extract unique years for filter
    const years = [...new Set(processedData.map(item => item.year))].sort((a, b) => a - b);
    setAvailableYears(years);

    return processedData;
  };

  // Apply filters to data
  useEffect(() => {
    if (data.length === 0) return;

    // Show filter loading state
    setFilterLoading(true);

    // Use setTimeout to simulate processing and show loader briefly
    const timer = setTimeout(() => {
      // Filter by year and vehicle type
      let filtered = data.filter(item => {
        const yearMatch = selectedYear === 'All' || item.year === parseInt(selectedYear);
        const typeMatch = vehicleType === 'All' || item.evType === vehicleType;
        return yearMatch && typeMatch;
      });

      // Count vehicles by manufacturer
      const manufacturerCounts = {};
      filtered.forEach(item => {
        if (item.make && item.make !== 'Unknown') {
          manufacturerCounts[item.make] = (manufacturerCounts[item.make] || 0) + 1;
        }
      });

      // Convert to chart format and sort by count (descending)
      const chartData = Object.entries(manufacturerCounts)
        .map(([make, count]) => ({
          make: make || 'Unknown',
          count: count || 0,
          percentage: filtered.length > 0 ? ((count / filtered.length) * 100).toFixed(1) : '0'
        }))
        .filter(item => item.count > 0) // Only show manufacturers with vehicles
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Show top 10 manufacturers for better readability

      console.log('Filtered data:', { 
        selectedYear, 
        vehicleType, 
        totalVehicles: filtered.length, 
        manufacturerCounts: Object.keys(manufacturerCounts).length,
        chartData: chartData.slice(0, 3) // Log first 3 for debugging
      });
      
      setFilteredData(chartData);
      setFilterLoading(false);
    }, 300); // Show loader for at least 300ms for smooth UX

    return () => clearTimeout(timer);
  }, [data, selectedYear, vehicleType]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-4 shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-3 text-center">{data.make}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Vehicles: {data.count.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Market Share: {data.percentage}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Loading state for initial data fetch
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-gray-600">Loading manufacturers...</span>
      </div>
    );
  }

  // Check if we have any data at all
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-500">No data available</div>
          <div className="text-sm text-gray-400 mt-2">Check if CSV file is accessible</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Simple Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-gray-50 rounded-lg">
        {/* Year Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-primary bg-white"
          >
            <option value="All">All Years</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Vehicle Type Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Vehicle Type</label>
          <div className="flex gap-1">
            {[
              { key: 'All', label: 'All' },
              { key: 'BEV', label: 'BEV' },
              { key: 'PHEV', label: 'PHEV' }
            ].map((type) => (
              <button
                key={type.key}
                onClick={() => setVehicleType(type.key)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  vehicleType === type.key
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart or Loading State */}
      {filterLoading ? (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
            <span className="text-sm text-gray-600">Updating chart...</span>
          </div>
        </div>
      ) : filteredData && filteredData.length > 0 ? (
        <div className="space-y-4">
          {/* Debug Info */}
          <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
            Debug: {filteredData.length} manufacturers, Total vehicles: {filteredData.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
          </div>
          
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={filteredData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis 
                dataKey="make" 
                type="category" 
                stroke="#6b7280"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                type="number" 
                stroke="#6b7280"
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="#10b981"
                radius={[6, 6, 0, 0]}
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
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {filteredData.length}
            </div>
            <div className="text-sm text-gray-600">Manufacturers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {filteredData.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Vehicles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {filteredData[0]?.make || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Top Manufacturer</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopManufacturersChart;
