import React from 'react';

const ChartContainer = ({ title, description, children, filters }) => {
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        {filters && (
          <div className="flex items-center gap-3">
            {filters}
          </div>
        )}
      </div>
      
      <div className="min-h-[300px]">
        {children}
      </div>
    </div>
  );
};

export default ChartContainer;
