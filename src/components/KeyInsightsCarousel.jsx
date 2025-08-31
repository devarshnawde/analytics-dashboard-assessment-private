import React, { useState, useEffect } from 'react';
import { TrendingUp, Car, Battery, Globe, Zap, Award, Users, MapPin } from 'lucide-react';

const KeyInsightsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const insights = [
    {
      id: 1,
      title: "Market Leader",
      value: "Tesla",
      description: "Dominates the EV market with the highest vehicle count",
      icon: Award,
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-gradient-to-r from-blue-500 to-purple-600"
    },
    {
      id: 2,
      title: "BEV Dominance",
      value: "68%",
      description: "Battery Electric Vehicles lead over Plug-in Hybrids",
      icon: Battery,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-gradient-to-r from-green-500 to-emerald-600"
    },
    {
      id: 3,
      title: "Top County",
      value: "King County",
      description: "Highest EV adoption rate in Washington State",
      icon: MapPin,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-gradient-to-r from-orange-500 to-red-600"
    },
    {
      id: 4,
      title: "Growth Trend",
      value: "49%",
      description: "Year-over-year increase in EV registrations",
      icon: TrendingUp,
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-gradient-to-r from-pink-500 to-rose-600"
    },
    {
      id: 5,
      title: "Popular Model",
      value: "Model 3",
      description: "Most registered electric vehicle model",
      icon: Car,
      color: "from-indigo-500 to-blue-600",
      bgColor: "bg-gradient-to-r from-indigo-500 to-blue-600"
    },
    {
      id: 6,
      title: "Charging Network",
      value: "2.7M",
      description: "Total charging stations across the state",
      icon: Zap,
      color: "from-yellow-500 to-orange-600",
      bgColor: "bg-gradient-to-r from-yellow-500 to-orange-600"
    }
  ];

  // Auto-rotate through insights
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % insights.length);
    }, 1000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [insights.length]);

  // Manual navigation
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + insights.length) % insights.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % insights.length);
  };

  return (
    <div className="flex flex-col items-center gap-3 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <div className={`inline-flex p-1.5 rounded-md ${insights[currentIndex].bgColor}`}>
          {React.createElement(insights[currentIndex].icon, { className: "h-4 w-4 text-white" })}
        </div>
        <span className="font-medium text-gray-700">
          {insights[currentIndex].title}: <span className="text-primary font-semibold">{insights[currentIndex].value}</span>
        </span>
      </div>
      
      {/* Small progress dots */}
      <div className="flex gap-1 ml-2">
        {insights.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-primary' 
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default KeyInsightsCarousel;
