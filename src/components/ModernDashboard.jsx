import React from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const ModernDashboard = () => {
  // Dummy data for charts
  const yearlyAdoptionData = [
    { year: '2018', adoption: 2.1, growth: 15 },
    { year: '2019', adoption: 2.6, growth: 24 },
    { year: '2020', adoption: 4.6, growth: 77 },
    { year: '2021', adoption: 6.6, growth: 43 },
    { year: '2022', adoption: 10.8, growth: 64 },
    { year: '2023', adoption: 16.2, growth: 50 },
    { year: '2024', adoption: 24.1, growth: 49 }
  ];

  const evTypesData = [
    { name: 'Battery Electric (BEV)', value: 68, color: '#3B82F6' },
    { name: 'Plug-in Hybrid (PHEV)', value: 32, color: '#10B981' }
  ];

  const popularMakesData = [
    { make: 'Tesla', sales: 1250000, marketShare: 18.2 },
    { make: 'BYD', sales: 1150000, marketShare: 16.8 },
    { make: 'Volkswagen', sales: 890000, marketShare: 13.1 },
    { make: 'BMW', sales: 650000, marketShare: 9.5 },
    { make: 'Mercedes', sales: 520000, marketShare: 7.6 },
    { make: 'Audi', sales: 480000, marketShare: 7.0 },
    { make: 'Hyundai', sales: 420000, marketShare: 6.1 }
  ];

  const evRangesData = [
    { range: '100-200', count: 15, percentage: 8 },
    { range: '200-300', count: 45, percentage: 24 },
    { range: '300-400', count: 78, percentage: 42 },
    { range: '400-500', count: 35, percentage: 19 },
    { range: '500+', count: 12, percentage: 7 }
  ];

  const insights = [
    {
      title: "Rapid Growth",
      value: "24.1M",
      subtitle: "EVs sold in 2024",
      trend: "+49%",
      trendUp: true,
      icon: "📈"
    },
    {
      title: "Market Leader",
      value: "Tesla",
      subtitle: "18.2% market share",
      trend: "1.25M units",
      trendUp: true,
      icon: "⚡"
    },
    {
      title: "Range Evolution",
      value: "300-400",
      subtitle: "Most common range (miles)",
      trend: "42% of EVs",
      trendUp: true,
      icon: "🔋"
    },
    {
      title: "BEV Dominance",
      value: "68%",
      subtitle: "Battery Electric Vehicles",
      trend: "vs 32% PHEV",
      trendUp: true,
      icon: "🚗"
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}M
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Electric Vehicle Analytics
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Comprehensive insights into the EV revolution
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">2024</div>
              <div className="text-sm text-gray-500">Global Overview</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {insights.map((insight, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{insight.icon}</div>
                <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
                  insight.trendUp 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {insight.trend}
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{insight.title}</h3>
              <div className="text-2xl font-bold text-gray-900 mb-1">{insight.value}</div>
              <p className="text-sm text-gray-500">{insight.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* EV Adoption Over Time */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">EV Adoption Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={yearlyAdoptionData}>
                <defs>
                  <linearGradient id="colorAdoption" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="year" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="adoption" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  fill="url(#colorAdoption)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* EV Types Distribution */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">EV Types Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={evTypesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {evTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Makes */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Most Popular EV Makes</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={popularMakesData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#6B7280" />
              <YAxis dataKey="make" type="category" stroke="#6B7280" width={100} />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                        <p className="font-semibold text-gray-900">{label}</p>
                        <p className="text-blue-600">Sales: {payload[0].value.toLocaleString()}</p>
                        <p className="text-green-600">Market Share: {payload[0].payload.marketShare}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="sales" 
                fill="url(#barGradient)"
                radius={[0, 4, 4, 0]}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* EV Ranges */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">EV Range Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={evRangesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="range" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                        <p className="font-semibold text-gray-900">{label} miles</p>
                        <p className="text-purple-600">Count: {payload[0].value}</p>
                        <p className="text-indigo-600">Percentage: {payload[0].payload.percentage}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="count" 
                fill="url(#rangeGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="rangeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;
