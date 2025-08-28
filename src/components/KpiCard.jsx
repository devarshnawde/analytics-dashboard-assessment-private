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
        return 'border-primary/20 bg-gradient-to-br from-primary-light to-white/80';
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
    <div className={`glass-card glass-card-hover p-4 ${getVariantClasses()}`}>
      <div className="flex items-center justify-center mb-2">
        <div className={`p-2 rounded-full bg-white/50 ${getIconColor()}`}>
          <Icon size={20} />
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-xl font-bold text-gray-900">{value}</p>
        <p className="text-xs font-medium text-gray-600">{title}</p>
        
        {trend && (
          <div className={`flex items-center justify-center text-xs ${
            trend.isPositive ? 'text-emerald-600' : 'text-red-500'
          }`}>
            <span>{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiCard;