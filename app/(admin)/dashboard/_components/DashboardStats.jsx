import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

function DashboardStats({
  title,
  value,
  subtitle,
  change,
  icon,
  loading,
  compact = false,
  className,
  customContent,
  showDate = false,
  isWide = false,
  showCurrencyDropdown = false,
  onCurrencyChange,
}) {
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');
  const [showDropdown, setShowDropdown] = useState(false);
  
  const currencies = [
    { code: 'NGN', symbol: '₦', rate: 1 },
    { code: 'USD', symbol: '$', rate: 0.0012 },
    { code: 'EUR', symbol: '€', rate: 0.0011 },
    { code: 'GBP', symbol: '£', rate: 0.00095 },
    { code: 'CAD', symbol: 'C$', rate: 0.0016 },
    { code: 'AUD', symbol: 'A$', rate: 0.0018 }
  ];

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const convertCurrency = (nairaValue, targetCurrency) => {
    const numericValue = parseFloat(nairaValue.replace(/[₦,]/g, ''));
    const currency = currencies.find(c => c.code === targetCurrency);
    const convertedValue = numericValue * currency.rate;
    
    return `${currency.symbol}${convertedValue.toLocaleString('en-US', {
      minimumFractionDigits: targetCurrency === 'NGN' ? 0 : 2,
      maximumFractionDigits: targetCurrency === 'NGN' ? 0 : 2
    })}`;
  };

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency.code);
    setShowDropdown(false);
    if (onCurrencyChange) {
      onCurrencyChange(currency.code);
    }
  };

  const displayValue = showCurrencyDropdown && value.includes('₦') 
    ? convertCurrency(value, selectedCurrency)
    : value;

  return (
    <Card
      className={cn(
        // Make the card fill the grid cell, avoid overflow, and keep height stable on tablet+
        "border border-gray-200 bg-white min-w-0 w-full h-auto md:h-40",
        className
      )}
    >
      <CardContent className="p-4 h-full flex flex-col justify-between">
        {loading ? (
          <div className="space-y-2">
            <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-3 w-12 bg-gray-200 animate-pulse rounded"></div>
          </div>
        ) : customContent ? (
          customContent
        ) : (
          <div className="h-full flex flex-col justify-between">
            {/* Top section with icon and title below it */}
            <div className="flex flex-col items-start">
              <div className="flex-shrink-0 mb-2">
                {React.cloneElement(icon, { className: "h-10 w-10" })}
              </div>
              <span className="text-xs font-medium text-gray-500 truncate">
                {title}
              </span>
            </div>
            
            {/* Value with currency dropdown */}
            <div className="text-xl font-bold text-gray-900 flex items-center justify-between flex-grow">
              <span className="truncate">{displayValue}</span>
              {showCurrencyDropdown && value.includes('₦') && (
                <div className="relative ml-2">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[80px]">
                      {currencies.map((currency) => (
                        <button
                          key={currency.code}
                          onClick={() => handleCurrencySelect(currency)}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                            selectedCurrency === currency.code ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                          }`}
                        >
                          {currency.code}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Subtitle */}
            {subtitle && (
              <div className="text-xs text-gray-400 truncate mb-1">
                {subtitle}
              </div>
            )}
            
            {/* Bottom row: Percentage and Date closer together */}
            <div className="flex items-center gap-2 text-xs">
              {change && (
                <div>
                  <span
                    className={
                      change.includes("+")
                        ? "text-[#3DC5A1] font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {change}
                  </span>
                </div>
              )}
              {showDate && (
                <div className="text-gray-400">{getCurrentDate()}</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DashboardStats;
