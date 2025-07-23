import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bath, Bed, BedDouble, CarFront, Home, Filter, DollarSign } from 'lucide-react'
  
function FilterSection({setBathCount,setBedCount,setParkingCount,setHomeType, setPriceRange}) {
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false)

  const handlePriceFilter = () => {
    if (setPriceRange) {
      setPriceRange({ min: minPrice, max: maxPrice })
    }
    setIsMoreFiltersOpen(false)
  }

  const clearPriceFilter = () => {
    setMinPrice('')
    setMaxPrice('')
    if (setPriceRange) {
      setPriceRange({ min: '', max: '' })
    }
  }

  return (
    <div className='flex flex-wrap gap-2 sm:gap-3 items-center'>
        {/* Bed Filter */}
        <Select onValueChange={(value) => setBedCount(value === 'Any' ? 0 : parseInt(value))}>
        <SelectTrigger className="w-[100px] sm:w-[140px] border-gray-300 bg-white hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200">
            <div className="flex items-center gap-1 sm:gap-2">
                <BedDouble className='h-3 w-3 sm:h-4 sm:w-4 text-emerald-500'/>
                <SelectValue placeholder="Bed" className="text-xs sm:text-sm font-medium" />
            </div>
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
            <SelectItem value="Any" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-xs sm:text-sm font-semibold text-gray-800'>
                     <BedDouble className='h-3 w-3 sm:h-4 sm:w-4 text-emerald-500'/> Any</h2>
            </SelectItem>
            {[1,2,3,4,5].map(num => (
                <SelectItem key={num} value={num.toString()} className="hover:bg-emerald-50 focus:bg-emerald-50">
                    <h2 className='flex gap-2 items-center text-xs sm:text-sm font-semibold text-gray-800'>
                         <BedDouble className='h-3 w-3 sm:h-4 sm:w-4 text-emerald-500'/> {num}+</h2>
                </SelectItem>
            ))}
        </SelectContent>
        </Select>

        {/* Bath Filter */}
        <Select onValueChange={(value) => setBathCount(value === 'Any' ? 0 : parseInt(value))}>
        <SelectTrigger className="w-[100px] sm:w-[140px] border-gray-300 bg-white hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200">
            <div className="flex items-center gap-1 sm:gap-2">
                <Bath className='h-3 w-3 sm:h-4 sm:w-4 text-emerald-500'/>
                <SelectValue placeholder="Bath" className="text-xs sm:text-sm font-medium" />
            </div>
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
            <SelectItem value="Any" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-xs sm:text-sm font-semibold text-gray-800'>
                     <Bath className='h-3 w-3 sm:h-4 sm:w-4 text-emerald-500'/> Any</h2>
            </SelectItem>
            {[1,2,3,4,5].map(num => (
                <SelectItem key={num} value={num.toString()} className="hover:bg-emerald-50 focus:bg-emerald-50">
                    <h2 className='flex gap-2 items-center text-xs sm:text-sm font-semibold text-gray-800'>
                         <Bath className='h-3 w-3 sm:h-4 sm:w-4 text-emerald-500'/> {num}+</h2>
                </SelectItem>
            ))}
        </SelectContent>
        </Select>

        {/* Parking Filter */}
        <Select onValueChange={(value) => setParkingCount(value === 'Any' ? 0 : parseInt(value))}>
        <SelectTrigger className="w-[100px] sm:w-[140px] border-gray-300 bg-white hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200">
            <div className="flex items-center gap-1 sm:gap-2">
                <CarFront className='h-3 w-3 sm:h-4 sm:w-4 text-emerald-500'/>
                <SelectValue placeholder="Parking" className="text-xs sm:text-sm font-medium" />
            </div>
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
            <SelectItem value="Any" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-xs sm:text-sm font-semibold text-gray-800'>
                     <CarFront className='h-3 w-3 sm:h-4 sm:w-4 text-emerald-500'/> Any</h2>
            </SelectItem>
            {[1,2,3,4].map(num => (
                <SelectItem key={num} value={num.toString()} className="hover:bg-emerald-50 focus:bg-emerald-50">
                    <h2 className='flex gap-2 items-center text-xs sm:text-sm font-semibold text-gray-800'>
                         <CarFront className='h-3 w-3 sm:h-4 sm:w-4 text-emerald-500'/> {num}+</h2>
                </SelectItem>
            ))}
        </SelectContent>
        </Select>
        
        {/* Property Type Filter - Hidden on very small screens */}
        <Select onValueChange={(value) => value === 'All' ? setHomeType(null) : setHomeType(value)}>
        <SelectTrigger className="w-[100px] sm:w-[140px] border-gray-300 bg-white hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200">
            <div className="flex items-center gap-1 sm:gap-2">
                <Home className='h-3 w-3 sm:h-4 sm:w-4 text-emerald-500'/>
                <SelectValue placeholder="Type" className="text-xs sm:text-sm font-medium" />
            </div>
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
            <SelectItem value="All" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-xs sm:text-sm font-semibold text-gray-800'>
                     <Home className='h-3 w-3 sm:h-4 sm:w-4 text-emerald-500'/> All Types</h2>
            </SelectItem>
            {['Single Family Home', 'Town House', 'Condo', 'Apartment'].map(type => (
                <SelectItem key={type} value={type} className="hover:bg-emerald-50 focus:bg-emerald-50">
                    <h2 className='flex gap-2 items-center text-xs sm:text-sm font-semibold text-gray-800'>
                         <Home className='h-3 w-3 sm:h-4 sm:w-4 text-emerald-500'/> {type.replace('Single Family Home', 'Single Family')}</h2>
                </SelectItem>
            ))}
        </SelectContent>
        </Select>

        {/* More Filters Button */}
        <Sheet open={isMoreFiltersOpen} onOpenChange={setIsMoreFiltersOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-4"
            >
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-emerald-500" />
              <span className="hidden sm:inline">More Filters</span>
              <span className="sm:hidden">More</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:w-[400px] md:w-[540px]">
            <SheetHeader>
              <SheetTitle className="text-lg sm:text-xl font-bold text-gray-900">Advanced Filters</SheetTitle>
              <SheetDescription className="text-gray-600 text-sm sm:text-base">
                Set additional criteria to find your perfect property.
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              {/* Price Range Filter */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                  <Label className="text-base font-semibold text-gray-900">Price Range</Label>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minPrice" className="text-sm font-medium text-gray-700">Minimum Price</Label>
                    <Input
                      id="minPrice"
                      type="number"
                      placeholder="₦0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxPrice" className="text-sm font-medium text-gray-700">Maximum Price</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      placeholder="₦100,000,000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-200"
                    />
                  </div>
                </div>
                
                {/* Quick Price Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'Under ₦5M', min: '', max: '5000000' },
                    { label: '₦5M - ₦15M', min: '5000000', max: '15000000' },
                    { label: '₦15M - ₦30M', min: '15000000', max: '30000000' },
                    { label: '₦30M - ₦50M', min: '30000000', max: '50000000' },
                    { label: '₦50M - ₦100M', min: '50000000', max: '100000000' },
                    { label: 'Over ₦100M', min: '100000000', max: '' }
                  ].map((range, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setMinPrice(range.min);
                        setMaxPrice(range.max);
                      }}
                      className="text-xs hover:bg-emerald-50 hover:border-emerald-400 transition-colors"
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button 
                  onClick={handlePriceFilter}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white flex-1"
                >
                  Apply Filters
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearPriceFilter}
                  className="border-gray-300 hover:bg-gray-50 flex-1"
                >
                  Clear All
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
    </div>
  )
}

export default FilterSection