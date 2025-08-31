import React from 'react';

// KPI Card Component following the provided interface design
const KpiCard = ({ title, value, icon: Icon, trend, variant = 'primary' }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'border-primary/20 bg-gradient-to-br from-primary-light to-white/80';
      case 'secondary':
        return 'border-secondary/20 bg-gradient-to-br from-secondary-light to-white/80';
      case 'amber':
        return 'border-accent-amber/20 bg-gradient-to-br from-accent-amber-light to-white/80';
      case 'emerald':
        return 'border-accent-emerald/20 bg-gradient-to-br from-accent-emerald-light to-white/80';
      default:
        return 'border-accent-emerald/20 bg-gradient-to-br from-accent-emerald-light to-white/80';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'primary':
        return 'text-primary';
      case 'secondary':
        return 'text-secondary';
      case 'amber':
        return 'text-accent-amber';
      case 'emerald':
        return 'text-accent-emerald';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className={`kpi-card p-3 ${getVariantClasses()}`}>
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-lg bg-white/60 ${getIconColor()}`}>
          <Icon size={16} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-gray-900 leading-tight">{value}</p>
          <p className="text-xs font-medium text-gray-600 truncate">{title}</p>
          
          {trend && (
            <div className={`flex items-center text-xs mt-0.5 ${
              trend.isPositive ? 'text-emerald-600' : 'text-red-500'
            }`}>
              <span className="font-medium">{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KpiCard;