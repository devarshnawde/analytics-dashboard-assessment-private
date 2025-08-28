import React from 'react';
import { TrendingUp, Car, Battery, Globe, Zap, Users, DollarSign } from 'lucide-react';
import KpiCard from './KpiCard';

const KpiCardExample = () => {
  const exampleKpis = [
    {
      title: "Total Revenue",
      value: "$2.4M",
      icon: DollarSign,
      trend: { value: 12.5, isPositive: true },
      variant: 'primary'
    },
    {
      title: "Active Users",
      value: "45.2K",
      icon: Users,
      trend: { value: 8.1, isPositive: true },
      variant: 'secondary'
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      icon: TrendingUp,
      trend: { value: 2.1, isPositive: false },
      variant: 'amber'
    },
    {
      title: "Customer Satisfaction",
      value: "94%",
      icon: Globe,
      trend: { value: 5.3, isPositive: true },
      variant: 'emerald'
    }
  ];

  return (
    <div className="p-6 bg-background min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">KPI Card Examples</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {exampleKpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      <div className="mt-8 p-6 glass-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Usage Examples</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Basic KPI Card:</h3>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`<KpiCard 
  title="Revenue" 
  value="$2.4M" 
  icon={DollarSign} 
  variant="primary" 
/>`}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">With Positive Trend:</h3>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`<KpiCard 
  title="Users" 
  value="45.2K" 
  icon={Users} 
  trend={{ value: 8.1, isPositive: true }}
  variant="secondary" 
/>`}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">With Negative Trend:</h3>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`<KpiCard 
  title="Conversion" 
  value="3.2%" 
  icon={TrendingUp} 
  trend={{ value: 2.1, isPositive: false }}
  variant="amber" 
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpiCardExample;
