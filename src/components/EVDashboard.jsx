import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Car, Battery, Globe, Zap } from 'lucide-react';
import KpiCard from './KpiCard';
import ChartContainer from './ChartContainer';
import EvolutionTrendsChart from './EvolutionTrendsChart';
import MarketShareChart from './MarketShareChart';
import TopManufacturersChart from './TopManufacturersChart';
import KeyInsightsCarousel from './KeyInsightsCarousel';
import MileageAnalysisChart from './MileageAnalysisChart';
import TopElectricProviders from './TopElectricProviders';

// Reusable Card Component
const Card = ({ children, className = "", hover = false }) => (
  <div className={`glass-card ${hover ? 'glass-card-hover' : ''} p-4 ${className}`}>
    {children}
  </div>
);

const EVDashboard = () => {






  const kpiData = [
    {
      title: "Global EV Sales",
      value: "24.1M",
      icon: TrendingUp,
      trend: { value: 49, isPositive: true },
      variant: 'primary'
    },
    {
      title: "Market Leader",
      value: "Tesla",
      icon: Car,
      trend: { value: 18.2, isPositive: true },
      variant: 'secondary'
    },
    {
      title: "BEV Dominance",
      value: "68%",
      icon: Battery,
      trend: { value: 32, isPositive: true },
      variant: 'emerald'
    },
    {
      title: "Charging Network",
      value: "2.7M",
      icon: Zap,
      trend: { value: 40, isPositive: true },
      variant: 'amber'
    },
    {
      title: "Market Penetration",
      value: "15.2%",
      icon: Globe,
      trend: { value: 3.1, isPositive: true },
      variant: 'primary'
    }
  ];



  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card mx-4 mt-4 mb-6">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">⚡ Electric Vehicle Insights</h1>
              <p className="text-sm text-gray-600">Washington State – EV Registration Data</p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 space-y-6">
        {/* KPI Cards Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Key Performance Indicators</h2>
            <KeyInsightsCarousel />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {kpiData.map((kpi, index) => (
              <KpiCard key={index} {...kpi} />
            ))}
          </div>
        </section>

        {/* Charts Grid */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Market Analysis</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* EV Adoption Over Time */}
            <ChartContainer 
              title="EV Adoption Growth"
              description="Year-over-year growth in electric vehicle adoption with interactive filters"
            >
              <EvolutionTrendsChart />
            </ChartContainer>

            {/* EV Market Share */}
            <ChartContainer 
              title="EV Market Share"
              description="BEV vs PHEV distribution by year and county with interactive filters"
            >
              <MarketShareChart />
            </ChartContainer>
          </div>
        </section>

        {/* Top Manufacturers Chart */}
        <section>
          <ChartContainer 
            title="Top Manufacturers"
            description="Most popular EV manufacturers across years and vehicle types"
          >
            <TopManufacturersChart />
          </ChartContainer>
        </section>

        {/* Mileage Analysis and Top Providers Side by Side */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Range Analysis & Market Leaders</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mileage Analysis Chart */}
            <ChartContainer 
              title="EV Range Distribution"
              description="Electric vehicle range distribution with year filters"
            >
              <MileageAnalysisChart />
            </ChartContainer>

            {/* Top Electric Providers */}
            <ChartContainer 
              title="Top 5 Electric Providers"
              description="Leading EV manufacturers by market share and vehicle type breakdown"
            >
              <TopElectricProviders />
            </ChartContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EVDashboard;
