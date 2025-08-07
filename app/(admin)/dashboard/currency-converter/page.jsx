"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CurrencyConverter from '@/components/CurrencyConverter';

const CurrencyConverterPage = () => {
  const handleConversionComplete = (result) => {
    console.log('Conversion completed:', result);
    // You can use this callback to update other parts of your UI
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Currency Converter</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Convert Currency</CardTitle>
        </CardHeader>
        <CardContent>
          <CurrencyConverter 
            initialAmount={1000} 
            initialFromCurrency="NGN" 
            initialToCurrency="USD" 
            onConversionComplete={handleConversionComplete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrencyConverterPage;