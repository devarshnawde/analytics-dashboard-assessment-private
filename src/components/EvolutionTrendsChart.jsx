import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Papa from 'papaparse';

const EvolutionTrendsChart = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [yearRange, setYearRange] = useState([2018, 2024]);
  const [vehicleType, setVehicleType] = useState('All');

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

        // Process the data to extract year and vehicle type information
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

  // Process CSV data to extract year and vehicle type information
  const processCSVData = (rawData) => {
    // Store raw data for filtering
    const processedData = rawData.map(item => {
      // Extract year from Model Year field
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
        year: year ? parseInt(year) : null,
        evType: mappedType,
        originalItem: item
      };
    }).filter(item => item.year && item.year >= 2010 && item.year <= 2024);

    return processedData;
  };

  // Apply filters to data
  useEffect(() => {
    if (data.length === 0) return;

    // Show filter loading state
    setFilterLoading(true);

    // Use setTimeout to simulate processing and show loader briefly
    const timer = setTimeout(() => {
      // Filter by year range and vehicle type
      let filtered = data.filter(item => {
        const yearMatch = item.year >= yearRange[0] && item.year <= yearRange[1];
        const typeMatch = vehicleType === 'All' || item.evType === vehicleType;
        return yearMatch && typeMatch;
      });

      // Group by year and count vehicles by type
      const yearCounts = {};
      filtered.forEach(item => {
        if (!yearCounts[item.year]) {
          yearCounts[item.year] = { year: item.year, BEV: 0, PHEV: 0 };
        }
        if (item.evType) {
          yearCounts[item.year][item.evType]++;
        }
      });

      // Convert to chart format
      const chartData = Object.values(yearCounts)
        .sort((a, b) => a.year - b.year);

      console.log('Filtered data:', { yearRange, vehicleType, filteredCount: filtered.length, chartData });
      setFilteredData(chartData);
      setFilterLoading(false);
    }, 300); // Show loader for at least 300ms for smooth UX

    return () => clearTimeout(timer);
  }, [data, yearRange, vehicleType]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-3 text-center">{label}</p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {entry.name}: {entry.value.toLocaleString()}
                </span>
              </div>
            ))}
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
      {/* Enhanced Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-3 bg-gradient-to-r from-gray-50/80 to-gray-100/60 rounded-lg border border-gray-200/50">
        {/* Year Range Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Year Range</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="2010"
              max="2024"
              value={yearRange[0]}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 2010;
                setYearRange([value, Math.max(value, yearRange[1])]);
              }}
              className="chart-filter w-20 text-center"
            />
            <span className="text-gray-500 text-sm">to</span>
            <input
              type="number"
              min="2010"
              max="2024"
              value={yearRange[1]}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 2024;
                setYearRange([Math.min(yearRange[0], value), value]);
              }}
              className="chart-filter w-24 text-center"
            />
          </div>
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
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="year" 
              stroke="hsl(var(--muted-foreground))"
              type="number"
              domain={['dataMin', 'dataMax']}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span className="text-gray-700 font-medium">{value}</span>
              )}
            />
            
            {/* BEV Line - Only show when All or BEV is selected */}
            {(vehicleType === 'All' || vehicleType === 'BEV') && (
              <Line 
                type="monotone" 
                dataKey="BEV" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                name="Battery Electric (BEV)"
              />
            )}
            
            {/* PHEV Line - Only show when All or PHEV is selected */}
            {(vehicleType === 'All' || vehicleType === 'PHEV') && (
              <Line 
                type="monotone" 
                dataKey="PHEV" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
                name="Plug-in Hybrid (PHEV)"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default EvolutionTrendsChart;
