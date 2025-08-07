import React, { useState, useEffect } from 'react';
import { authAPI } from '@/utils/api/auth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const PreferredCurrencySelector = ({ onCurrencyChange }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await authAPI.getCountries();
        setCountries(response.data);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('Failed to load countries');
      }
    };

    fetchCountries();
  }, []);

  const handleUpdateCurrency = async () => {
    if (!selectedCountry) {
      setError('Please select a country');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const country = countries.find(c => c.id === selectedCountry);
      
      await authAPI.updateCurrency({
        currency_code: country.currency_code,
        currency_symbol: country.currency_symbol,
        country: country.id
      });

      setSuccess(true);
      
      if (onCurrencyChange) {
        onCurrencyChange({
          countryId: country.id,
          currencyCode: country.currency_code,
          currencySymbol: country.currency_symbol
        });
      }
    } catch (err) {
      console.error('Error updating currency:', err);
      setError('Failed to update preferred currency');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="country">Select Your Preferred Currency</Label>
        <Select
          value={selectedCountry}
          onValueChange={setSelectedCountry}
        >
          <SelectTrigger id="country" className="w-full">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.id} value={country.id}>
                {country.name} ({country.currency_symbol} {country.currency_code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={handleUpdateCurrency} 
        disabled={isLoading || !selectedCountry}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
      >
        {isLoading ? 'Updating...' : 'Set as Preferred Currency'}
      </Button>

      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}

      {success && (
        <div className="text-emerald-500 text-sm mt-2">
          Your preferred currency has been updated successfully.
        </div>
      )}
    </div>
  );
};

export default PreferredCurrencySelector;