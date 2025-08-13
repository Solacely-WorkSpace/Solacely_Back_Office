"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { listingsAPI } from "@/utils/api/listings";

// Using only four colors as requested
const colors = ["#0062FF", "#3DD598", "#FFC542", "#FF974A"];

function PropertyChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [totalListings, setTotalListings] = useState(0);

  useEffect(() => {
    fetchLocationData();
  }, [selectedYear]); // Re-fetch when year changes for UI consistency

  const fetchLocationData = async () => {
    setLoading(true);
    try {
      const response = await listingsAPI.getListings({ status: "available" });
      const listings = response.results || response;

      if (listings) {
        // Extract city/state from location and count occurrences
        const locationCounts = {};

        listings.forEach((listing) => {
          if (listing.location) {
            // Extract the last part of the location (usually city/state)
            const locationParts = listing.location.split(",");
            let location = "Other";

            if (locationParts.length >= 2) {
              location = locationParts[locationParts.length - 2].trim();
            } else if (locationParts.length === 1) {
              location = locationParts[0].trim();
            }

            // Clean up common location names
            if (location.toLowerCase().includes("lagos")) {
              location = "Lagos";
            } else if (location.toLowerCase().includes("abuja")) {
              location = "Abuja";
            } else if (location.toLowerCase().includes("kano")) {
              location = "Kano";
            } else if (location.toLowerCase().includes("kaduna")) {
              location = "Kaduna";
            }

            locationCounts[location] = (locationCounts[location] || 0) + 1;
          }
        });

        // Convert to chart data format
        const total = listings.length;
        setTotalListings(total);

        // Ensure we have the four main locations we want to display
        const mainLocations = ["Lagos", "Kano", "Abuja", "Kaduna"];
        mainLocations.forEach((loc) => {
          if (!locationCounts[loc]) {
            locationCounts[loc] = 0;
          }
        });

        // Create chart data with our four main locations
        const chartData = mainLocations.map((name, index) => ({
          name,
          value: locationCounts[name],
          color: colors[index % colors.length],
        }));

        setData(chartData);
      }
    } catch (error) {
      console.error("Error in fetchLocationData:", error);
      // Fallback data if API fails
      const fallbackData = [
        { name: "Lagos", value: 2500, color: colors[0] },
        { name: "Kano", value: 2200, color: colors[1] },
        { name: "Abuja", value: 1300, color: colors[2] },
        { name: "Kaduna", value: 18000, color: colors[3] },
      ];
      setData(fallbackData);
      setTotalListings(24000);
    } finally {
      setLoading(false);
    }
  };

  // Format numbers with k for thousands
  const formatNumber = (num) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + "k" : num;
  };

  // Handle year navigation
  const navigateYear = (direction) => {
    const currentYear = parseInt(selectedYear);
    const newYear = direction === "prev" ? currentYear - 1 : currentYear + 1;
    setSelectedYear(newYear.toString());
  };

  if (loading) {
    return (
      <Card className="overflow-hidden rounded-xl shadow-sm max-w-[380px] h-[420px] mx-auto"> {/* Increased from 300px to 380px width and 350px to 420px height */}
        <CardHeader className="flex justify-center items-center pb-2">
          <div className="flex items-center justify-center space-x-20">
            <button className="text-gray-400 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="text-lg font-medium">{selectedYear}</div>
            <button className="text-gray-400 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-4 pb-2 px-3">
          {/* Skeleton for pie chart */}
          <div className="relative">
            <div className="w-full h-[240px] flex items-center justify-center"> {/* Increased from 200px to 240px */}
              <div className="w-[200px] h-[200px] rounded-full bg-gray-100 animate-pulse flex items-center justify-center"> {/* Increased from 180px to 200px */}
                <div className="w-[160px] h-[160px] rounded-full bg-white flex items-center justify-center"> {/* Increased from 140px to 160px */}
                  <div className="w-20 h-6 bg-gray-200 animate-pulse rounded-md"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Skeleton for 2x2 grid */}
          <div className="mt-4 grid grid-cols-2 gap-2 pb-1 mx-auto w-[280px]"> {/* Increased from 240px to 280px */}
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="flex items-center justify-between px-2"
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-1.5 bg-gray-200"></div>
                  <div className="w-12 h-3 bg-gray-200 animate-pulse rounded-md"></div>
                </div>
                <div className="w-8 h-3 bg-gray-200 animate-pulse rounded-md ml-1"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-xl shadow-sm max-w-[380px] h-[420px] mx-auto"> {/* Increased from 300px to 380px width and 350px to 420px height */}
      <CardHeader className="flex justify-center items-center pb-2">
        {/* Year selector with left/right arrows */}
        <div className="flex items-center justify-center space-x-20">
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={() => navigateYear("prev")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="text-lg font-medium">{selectedYear}</div>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={() => navigateYear("next")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-4 pb-2 px-3">
        <div className="relative">
          <ResponsiveContainer width="100%" height={240}> 
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={90} 
                outerRadius={100} 
                paddingAngle={2}
                dataKey="value"
                strokeWidth={4}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold"> {/* Increased from text-2xl to text-3xl */}
                {totalListings.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Visitors this year</div> {/* Increased from text-xs to text-sm */}
            </div>
          </div>
        </div>

        {/* 2x2 grid layout with centered items and wider spacing between name and value */}
        <div className="mt-4 grid grid-cols-2 gap-6 pb-1 mx-auto w-[320px]"> {/* Increased gap from gap-2 to gap-6 and width from 280px to 320px */}
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-start px-2"> {/* Changed from justify-between to justify-start */}
              <div className="flex items-center">
                <div
                  className="w-2 h-2 rounded-full mr-1.5"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
              <span className="text-sm font-medium ml-3"> {/* Increased margin from ml-1 to ml-3 to bring name and value closer */}
                {formatNumber(item.value)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default PropertyChart;
