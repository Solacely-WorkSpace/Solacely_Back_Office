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
    <div className='flex flex-wrap gap-3 items-center'>
        {/* Bed Filter */}
        <Select onValueChange={(value) => setBedCount(value === 'Any' ? 0 : parseInt(value))}>
        <SelectTrigger className="w-[140px] border-gray-300 bg-white hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200">
            <div className="flex items-center gap-2">
                <BedDouble className='h-4 w-4 text-emerald-500'/>
                <SelectValue placeholder="Bed" className="text-sm font-medium" />
            </div>
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
            <SelectItem value="Any" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <BedDouble className='h-4 w-4 text-emerald-500'/> Any</h2>
            </SelectItem>
            <SelectItem value="1" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <BedDouble className='h-4 w-4 text-emerald-500'/> 1+</h2>
            </SelectItem>
            <SelectItem value="2" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <BedDouble className='h-4 w-4 text-emerald-500'/> 2+</h2>
            </SelectItem>
            <SelectItem value="3" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <BedDouble className='h-4 w-4 text-emerald-500'/> 3+</h2>
            </SelectItem>
            <SelectItem value="4" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <BedDouble className='h-4 w-4 text-emerald-500'/> 4+</h2>
            </SelectItem>
            <SelectItem value="5" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <BedDouble className='h-4 w-4 text-emerald-500'/> 5+</h2>
            </SelectItem>
        </SelectContent>
        </Select>

        {/* Bath Filter */}
        <Select onValueChange={(value) => setBathCount(value === 'Any' ? 0 : parseInt(value))}>
        <SelectTrigger className="w-[140px] border-gray-300 bg-white hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200">
            <div className="flex items-center gap-2">
                <Bath className='h-4 w-4 text-emerald-500'/>
                <SelectValue placeholder="Bath" className="text-sm font-medium" />
            </div>
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
            <SelectItem value="Any" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <Bath className='h-4 w-4 text-emerald-500'/> Any</h2>
            </SelectItem>
            <SelectItem value="1" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <Bath className='h-4 w-4 text-emerald-500'/> 1+</h2>
            </SelectItem>
            <SelectItem value="2" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <Bath className='h-4 w-4 text-emerald-500'/> 2+</h2>
            </SelectItem>
            <SelectItem value="3" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <Bath className='h-4 w-4 text-emerald-500'/> 3+</h2>
            </SelectItem>
            <SelectItem value="4" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <Bath className='h-4 w-4 text-emerald-500'/> 4+</h2>
            </SelectItem>
            <SelectItem value="5" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <Bath className='h-4 w-4 text-emerald-500'/> 5+</h2>
            </SelectItem>
        </SelectContent>
        </Select>

        {/* Parking Filter */}
        <Select onValueChange={(value) => setParkingCount(value === 'Any' ? 0 : parseInt(value))}>
        <SelectTrigger className="w-[140px] border-gray-300 bg-white hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200">
            <div className="flex items-center gap-2">
                <CarFront className='h-4 w-4 text-emerald-500'/>
                <SelectValue placeholder="Parking" className="text-sm font-medium" />
            </div>
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
            <SelectItem value="Any" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <CarFront className='h-4 w-4 text-emerald-500'/> Any</h2>
            </SelectItem>
            <SelectItem value="1" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <CarFront className='h-4 w-4 text-emerald-500'/> 1+</h2>
            </SelectItem>
            <SelectItem value="2" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <CarFront className='h-4 w-4 text-emerald-500'/> 2+</h2>
            </SelectItem>
            <SelectItem value="3" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <CarFront className='h-4 w-4 text-emerald-500'/> 3+</h2>
            </SelectItem>
            <SelectItem value="4" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <CarFront className='h-4 w-4 text-emerald-500'/> 4+</h2>
            </SelectItem>
        </SelectContent>
        </Select>
        
        {/* Property Type Filter */}
        <Select onValueChange={(value) => value === 'All' ? setHomeType(null) : setHomeType(value)}>
        <SelectTrigger className="w-[140px] border-gray-300 bg-white hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200">
            <div className="flex items-center gap-2">
                <Home className='h-4 w-4 text-emerald-500'/>
                <SelectValue placeholder="Type" className="text-sm font-medium" />
            </div>
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
            <SelectItem value="All" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <Home className='h-4 w-4 text-emerald-500'/> All Types</h2>
            </SelectItem>
            <SelectItem value="Single Family Home" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <Home className='h-4 w-4 text-emerald-500'/> Single Family</h2>
            </SelectItem>
            <SelectItem value="Town House" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <Home className='h-4 w-4 text-emerald-500'/> Town House</h2>
            </SelectItem>
            <SelectItem value="Condo" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <Home className='h-4 w-4 text-emerald-500'/> Condo</h2>
            </SelectItem>
            <SelectItem value="Apartment" className="hover:bg-emerald-50 focus:bg-emerald-50">
                <h2 className='flex gap-2 items-center text-sm font-semibold text-gray-800'>
                     <Home className='h-4 w-4 text-emerald-500'/> Apartment</h2>
            </SelectItem>
        </SelectContent>
        </Select>

        {/* More Filters Button */}
        <Sheet open={isMoreFiltersOpen} onOpenChange={setIsMoreFiltersOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200"
            >
              <Filter className="h-4 w-4 mr-2 text-emerald-500" />
              More Filters
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle className="text-xl font-bold text-gray-900">Advanced Filters</SheetTitle>
              <SheetDescription className="text-gray-600">
                Set additional criteria to find your perfect property.
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              {/* Price Range Filter */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                  <Label className="text-base font-semibold text-gray-900">Price Range (₦/month)</Label>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minPrice" className="text-sm font-medium text-gray-700">Minimum Price</Label>
                    <Input
                      id="minPrice"
                      type="number"
                      placeholder="e.g., 500000"
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
                      placeholder="e.g., 5000000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-200"
                    />
                  </div>
                </div>
                
                {/* Quick Price Ranges */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Quick Select</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => { setMinPrice('500000'); setMaxPrice('1000000'); }}
                      className="text-xs hover:bg-emerald-50 hover:border-emerald-400"
                    >
                      ₦500K - ₦1M
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => { setMinPrice('1000000'); setMaxPrice('2500000'); }}
                      className="text-xs hover:bg-emerald-50 hover:border-emerald-400"
                    >
                      ₦1M - ₦2.5M
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => { setMinPrice('2500000'); setMaxPrice('5000000'); }}
                      className="text-xs hover:bg-emerald-50 hover:border-emerald-400"
                    >
                      ₦2.5M - ₦5M
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => { setMinPrice('5000000'); setMaxPrice(''); }}
                      className="text-xs hover:bg-emerald-50 hover:border-emerald-400"
                    >
                      ₦5M+
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  onClick={handlePriceFilter}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  Apply Filters
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearPriceFilter}
                  className="flex-1 border-gray-300 hover:bg-gray-50"
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