import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Papa from 'papaparse';
import { Zap, TrendingUp, Car, Award } from 'lucide-react';

const TopElectricProviders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topProviders, setTopProviders] = useState([]);

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

        // Process the data to extract manufacturer information
        const processedData = processCSVData(result.data);
        setData(processedData);
        
        // Get top 5 providers
        const top5 = getTopProviders(processedData);
        setTopProviders(top5);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process CSV data to extract manufacturer information
  const processCSVData = (rawData) => {
    const processedData = rawData.map(item => {
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
        evType: mappedType
      };
    }).filter(item => 
      item.make !== 'Unknown' && 
      item.year && 
      item.year >= 2010 && 
      item.year <= 2024
    );

    return processedData;
  };

  // Get top 5 providers by vehicle count
  const getTopProviders = (processedData) => {
    const providerCounts = {};
    
    processedData.forEach(item => {
      if (!providerCounts[item.make]) {
        providerCounts[item.make] = {
          make: item.make,
          totalVehicles: 0,
          bevCount: 0,
          phevCount: 0,
          years: new Set()
        };
      }
      
      providerCounts[item.make].totalVehicles++;
      providerCounts[item.make].years.add(item.year);
      
      if (item.evType === 'BEV') {
        providerCounts[item.make].bevCount++;
      } else if (item.evType === 'PHEV') {
        providerCounts[item.make].phevCount++;
      }
    });

    // Convert to array and sort by total vehicles
    const providersArray = Object.values(providerCounts).map(provider => ({
      ...provider,
      years: provider.years.size,
      bevPercentage: ((provider.bevCount / provider.totalVehicles) * 100).toFixed(1),
      phevPercentage: ((provider.phevCount / provider.totalVehicles) * 100).toFixed(1)
    }));

    return providersArray
      .sort((a, b) => b.totalVehicles - a.totalVehicles)
      .slice(0, 5);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 shadow-lg border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 bg-primary rounded-full"></div>
            <p className="font-semibold text-gray-900">{data.make}</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Vehicles:</span>
              <span className="font-semibold">{data.totalVehicles.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">BEV:</span>
              <span className="text-green-600 font-medium">{data.bevCount.toLocaleString()} ({data.bevPercentage}%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">PHEV:</span>
              <span className="text-orange-600 font-medium">{data.phevCount.toLocaleString()} ({data.phevPercentage}%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Years Active:</span>
              <span className="font-medium">{data.years}</span>
            </div>
          </div>
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
        <span className="ml-2 text-gray-600">Loading provider data...</span>
      </div>
    );
  }

  // Prepare chart data with colors
  const COLORS = ['#f59e0b', '#6b7280', '#d97706', '#3b82f6', '#8b5cf6'];
  
  const chartData = topProviders.map((provider, index) => ({
    ...provider,
    name: provider.make,
    value: provider.totalVehicles,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="space-y-4">
      {/* Enhanced Header with summary */}
      <div className="text-center p-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/60 rounded-md border border-blue-200/30">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900">Top 5 EV Providers</h3>
        </div>
        <div className="text-xs text-gray-600">
          Total: {topProviders.reduce((sum, p) => sum + p.totalVehicles, 0).toLocaleString()} vehicles
        </div>
      </div>

             {/* Chart */}
       {chartData && chartData.length > 0 ? (
         <div className="space-y-4">
           <ResponsiveContainer width="100%" height={280}>
             <PieChart>
               <Pie
                 data={chartData}
                 cx="50%"
                 cy="50%"
                 labelLine={false}
                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                 outerRadius={80}
                 fill="#8884d8"
                 dataKey="value"
               >
                 {chartData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.color} />
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

         </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-gray-500">No data available</div>
            <div className="text-sm text-gray-400 mt-2">Unable to load provider data</div>
          </div>
        </div>
      )}

             {/* Compact Market Insights */}
       {!loading && topProviders && topProviders.length > 0 && (
         <div className="flex gap-2">
           <div className="flex-1 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/50 rounded-lg p-2">
             <div className="flex items-center justify-around">
               <div className="text-xs text-amber-700 font-medium">Market Leader</div>
               <div className="text-sm font-bold text-amber-800 truncate">
                 {topProviders[0]?.make || 'N/A'}
               </div>
             </div>
           </div>
           <div className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-lg p-2">
             <div className="flex items-center justify-around">
               <div className="text-xs text-green-700 font-medium">Leader's EVs</div>
               <div className="text-sm font-bold text-green-800">
                 {topProviders[0]?.totalVehicles.toLocaleString() || '0'}
               </div>
             </div>
           </div>
           <div className="flex-1 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 rounded-lg p-2">
             <div className="flex items-center justify-around">
               <div className="text-xs text-blue-700 font-medium">Market Share</div>
               <div className="text-sm font-bold text-blue-800">
                 {((topProviders[0]?.totalVehicles / topProviders.reduce((sum, p) => sum + p.totalVehicles, 0)) * 100).toFixed(1)}%
               </div>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

export default TopElectricProviders;
