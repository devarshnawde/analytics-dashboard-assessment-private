import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
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
        const response = await fetch('/Electric_Vehicle_Population_Data.csv');
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
          percentage: filtered.length > 0 ? ((count / filtered.length) * 100).toFixed(1) : '0',
          name: make || 'Unknown',
          value: count || 0
        }))
        .filter(item => item.count > 0) // Only show manufacturers with vehicles
        .sort((a, b) => b.count - a.count)
        .slice(0, 8); // Show top 8 manufacturers for better readability

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
        <div className="bg-white p-4 shadow-lg border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: data.color }}></div>
            <p className="font-semibold text-gray-900">{data.make}</p>
          </div>
          <div className="space-y-2 text-sm">
                         <div className="flex justify-between">
               <span className="text-gray-600">Vehicles:</span>
               <span className="font-semibold">{data.count?.toLocaleString() || '0'}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-gray-600">Market Share:</span>
               <span className="font-medium text-blue-600">{data.percentage || '0'}%</span>
             </div>
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
      {/* Enhanced Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-3 bg-gradient-to-r from-gray-50/80 to-gray-100/60 rounded-lg border border-gray-200/50">
        {/* Year Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="chart-filter min-w-[120px]"
          >
            <option value="All">All Years</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Vehicle Type Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Vehicle Type</label>
          <div className="flex gap-1">
            {[
              { key: 'All', label: 'All' },
              { key: 'BEV', label: 'BEV' },
              { key: 'PHEV', label: 'PHEV' }
            ].map((type) => (
              <button
                key={type.key}
                onClick={() => setVehicleType(type.key)}
                className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all ${
                  vehicleType === type.key
                    ? 'bg-blue-600 text-white shadow-sm border border-blue-600'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400'
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
          {/* Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                                 label={({ name, percentage }) => `${name} ${percentage || 0}%`}
                labelLine={false}
              >
                {filteredData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={['#f59e0b', '#6b7280', '#d97706', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444', '#06b6d4'][index % 8]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span className="text-xs text-gray-700">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Top 3 Manufacturers with Stats */}
          <div className="grid grid-cols-3 gap-3">
            {filteredData.slice(0, 3).map((manufacturer, index) => (
              <div key={manufacturer.make} className="text-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                  index === 0 ? 'bg-yellow-500' : 
                  index === 1 ? 'bg-gray-400' : 
                  'bg-amber-600'
                }`}></div>
                <div className="text-sm font-semibold text-gray-800 truncate">{manufacturer.make}</div>
                                 <div className="text-lg font-bold text-blue-600">{manufacturer.count?.toLocaleString() || '0'}</div>
                 <div className="text-xs text-gray-600">{manufacturer.percentage || '0'}% market share</div>
              </div>
            ))}
          </div>
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
      {/* {!filterLoading && filteredData && filteredData.length > 0 && (
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
      )} */}
    </div>
  );
};

export default TopManufacturersChart;
