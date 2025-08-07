import React, { useState, useEffect } from 'react';
import { authAPI } from '@/utils/api/auth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Default currencies to use when API fails or is loading
const DEFAULT_CURRENCIES = [
  { id: 1, currency_code: "NGN", currency_symbol: "₦", currency_name: "Nigerian Naira" },
  { id: 2, currency_code: "USD", currency_symbol: "$", currency_name: "US Dollar" },
  { id: 3, currency_code: "EUR", currency_symbol: "€", currency_name: "Euro" },
  { id: 4, currency_code: "GBP", currency_symbol: "£", currency_name: "British Pound" }
];

const CurrencyConverter = ({ initialAmount = 0, initialFromCurrency = 'NGN', initialToCurrency = 'USD', onConversionComplete }) => {
  const [amount, setAmount] = useState(initialAmount);
  const [fromCurrency, setFromCurrency] = useState(initialFromCurrency);
  const [toCurrency, setToCurrency] = useState(initialToCurrency);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState(DEFAULT_CURRENCIES); // Initialize with default currencies
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);

  // Fetch available countries/currencies
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoadingCountries(true);
      try {
        const response = await authAPI.getCountries();
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setCountries(response.data);
        }
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('Failed to load currency options');
        // Keep using the default currencies
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  const handleConvert = async () => {
    if (!amount || !fromCurrency || !toCurrency) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.convertCurrency({
        amount: parseFloat(amount),
        from_code: fromCurrency,
        to_code: toCurrency
      });

      setConvertedAmount(response.data.converted_amount);
      
      if (onConversionComplete) {
        onConversionComplete({
          originalAmount: amount,
          convertedAmount: response.data.converted_amount,
          fromCurrency,
          toCurrency
        });
      }
    } catch (err) {
      console.error('Conversion error:', err);
      setError('Failed to convert currency. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConvertedAmount(null);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setConvertedAmount(null);
          }}
          placeholder="Enter amount"
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fromCurrency">From Currency</Label>
          <Select
            value={fromCurrency}
            onValueChange={(value) => {
              setFromCurrency(value);
              setConvertedAmount(null);
            }}
          >
            <SelectTrigger id="fromCurrency" className="w-full">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingCountries ? (
                <SelectItem value="loading" disabled>Loading currencies...</SelectItem>
              ) : countries && countries.length > 0 ? (
                countries.map((country) => (
                  <SelectItem key={`from-${country.currency_code}`} value={country.currency_code}>
                    {country.currency_symbol} {country.currency_code} - {country.currency_name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="error" disabled>Failed to load currencies</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="toCurrency">To Currency</Label>
          <Select
            value={toCurrency}
            onValueChange={(value) => {
              setToCurrency(value);
              setConvertedAmount(null);
            }}
          >
            <SelectTrigger id="toCurrency" className="w-full">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingCountries ? (
                <SelectItem value="loading" disabled>Loading currencies...</SelectItem>
              ) : countries && countries.length > 0 ? (
                countries.map((country) => (
                  <SelectItem key={`to-${country.currency_code}`} value={country.currency_code}>
                    {country.currency_symbol} {country.currency_code} - {country.currency_name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="error" disabled>Failed to load currencies</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleConvert} 
          disabled={isLoading}
          className="bg-emerald-500 hover:bg-emerald-600 text-white flex-1"
        >
          {isLoading ? 'Converting...' : 'Convert'}
        </Button>
        <Button 
          onClick={handleSwapCurrencies} 
          variant="outline" 
          className="border-gray-300 hover:bg-gray-50 flex-1"
        >
          Swap Currencies
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}

      {convertedAmount !== null && (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-md">
          <p className="text-sm text-gray-600">Converted Amount:</p>
          <p className="text-xl font-semibold text-emerald-700">
            {toCurrency} {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            1 {fromCurrency} = {(convertedAmount / amount).toFixed(4)} {toCurrency}
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;