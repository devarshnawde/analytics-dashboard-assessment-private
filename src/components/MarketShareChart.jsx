import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import Papa from 'papaparse';

const MarketShareChart = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedCounty, setSelectedCounty] = useState('All');
  const [availableYears, setAvailableYears] = useState([]);
  const [availableCounties, setAvailableCounties] = useState([]);

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

        // Process the data to extract year, county, and vehicle type information
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

  // Process CSV data to extract year, county, and vehicle type information
  const processCSVData = (rawData) => {
    const processedData = rawData.map(item => {
      // Extract year from Model Year field
      const year = item['Model Year'];
      const county = item['County'];
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
        year: year ? parseInt(year) : null,
        county: county || 'Unknown',
        evType: mappedType,
        originalItem: item
      };
    }).filter(item => item.year && item.year >= 2010 && item.year <= 2024 && item.county !== 'Unknown');

    // Extract unique years and counties for filters
    const years = [...new Set(processedData.map(item => item.year))].sort((a, b) => a - b);
    const counties = [...new Set(processedData.map(item => item.county))].sort();
    
    setAvailableYears(years);
    setAvailableCounties(counties);

    return processedData;
  };

  // Apply filters to data
  useEffect(() => {
    if (data.length === 0) return;

    // Show filter loading state
    setFilterLoading(true);

    // Use setTimeout to simulate processing and show loader briefly
    const timer = setTimeout(() => {
      // Filter by year and county
      let filtered = data.filter(item => {
        const yearMatch = selectedYear === 'All' || item.year === parseInt(selectedYear);
        const countyMatch = selectedCounty === 'All' || item.county === selectedCounty;
        return yearMatch && countyMatch;
      });

      // Count vehicles by type
      const bevCount = filtered.filter(item => item.evType === 'BEV').length;
      const phevCount = filtered.filter(item => item.evType === 'PHEV').length;
      const total = bevCount + phevCount;

      // Convert to chart format
      const chartData = [
        { name: 'Battery Electric (BEV)', value: bevCount, percentage: total > 0 ? ((bevCount / total) * 100).toFixed(1) : 0, color: '#10b981' },
        { name: 'Plug-in Hybrid (PHEV)', value: phevCount, percentage: total > 0 ? ((phevCount / total) * 100).toFixed(1) : 0, color: '#f59e0b' }
      ];

      console.log('Filtered data:', { selectedYear, selectedCounty, total, chartData });
      setFilteredData(chartData);
      setFilterLoading(false);
    }, 300); // Show loader for at least 300ms for smooth UX

    return () => clearTimeout(timer);
  }, [data, selectedYear, selectedCounty]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length && payload[0].payload) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-4 shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-3 text-center">{data.name}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: data.color }}
              />
              <span className="text-sm font-medium text-gray-700">
                Count: {data.value ? data.value.toLocaleString() : '0'}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Market Share: {data.percentage || 0}%
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
        <span className="ml-2 text-gray-600">Loading data...</span>
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

        {/* County Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">County</label>
          <select
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-primary bg-white"
          >
            <option value="All">All Counties</option>
            {availableCounties.map(county => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
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
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={filteredData || []}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {(filteredData || []).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span className="text-gray-700 font-medium">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}

      {/* Summary Stats */}
      {!filterLoading && filteredData && filteredData.length > 0 && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          {filteredData.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold" style={{ color: item.color }}>
                {item.percentage}%
              </div>
              <div className="text-sm text-gray-600">{item.name}</div>
              <div className="text-xs text-gray-500">
                {item.value ? item.value.toLocaleString() : '0'} vehicles
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketShareChart;
