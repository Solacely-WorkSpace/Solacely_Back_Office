"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { adminAPI } from "@/utils/api/admin";
import { toast } from "sonner";
import { usersAPI } from "@/utils/api/users";

function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);

  // Fetch customers from the backend
  useEffect(() => {
    fetchCustomers();
  }, [currentPage]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await usersAPI.getUsers();

      // Add null check before accessing response
      if (response) {
        setCustomers(response.results || []);
        setTotalPages(Math.ceil((response.count || 0) / 10)); // Assuming 10 items per page
        setTotalCustomers(response.count || 0);
      } else {
        setCustomers([]);
        setTotalPages(1);
        setTotalCustomers(0);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to load customers");
      setCustomers([]);
      setTotalPages(1);
      setTotalCustomers(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    fetchCustomers();
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCustomers(customers.map((customer) => customer.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId, checked) => {
    if (checked) {
      setSelectedCustomers((prev) => [...prev, customerId]);
    } else {
      setSelectedCustomers((prev) => prev.filter((id) => id !== customerId));
    }
  };

  const handleUpdateUserStatus = async (userId, status) => {
    try {
      await adminAPI.updateUserStatus(userId, status);
      toast.success(`User status updated to ${status}`);
      fetchCustomers(); // Refresh the list
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search for customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-sm border-1 rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
      </div>

      {/* Table Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-[#F8F7FE]">
                  <th className="text-left py-4 px-4 w-12">
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      checked={
                        customers.length > 0 &&
                        selectedCustomers.length === customers.length
                      }
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                    />
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Full Name</span>
                      <div className="flex flex-col">
                        <ChevronUp className="w-3 h-3 text-gray-400" />
                        <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                      </div>
                    </div>
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Email</span>
                      <div className="flex flex-col">
                        <ChevronUp className="w-3 h-3 text-gray-400" />
                        <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                      </div>
                    </div>
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Phone number</span>
                      <div className="flex flex-col">
                        <ChevronUp className="w-3 h-3 text-gray-400" />
                        <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                      </div>
                    </div>
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Location</span>
                      <div className="flex flex-col">
                        <ChevronUp className="w-3 h-3 text-gray-400" />
                        <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                      </div>
                    </div>
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Action</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  // Loading skeleton
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <tr key={`skeleton-${index}`} className="animate-pulse">
                        <td className="py-3 px-4">
                          <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="h-4 w-40 bg-gray-200 rounded"></div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="h-8 w-16 bg-gray-200 rounded"></div>
                        </td>
                      </tr>
                    ))
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-gray-500">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={(e) =>
                            handleSelectCustomer(customer.id, e.target.checked)
                          }
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={customer.profile_image}
                              alt={customer.full_name}
                            />
                            <AvatarFallback className="bg-purple-100 text-purple-600 text-sm">
                              {customer.full_name
                                ? customer.full_name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-gray-900">
                            {customer.full_name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {customer.email}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {customer.phone_number || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {customer.location || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
                            onClick={() =>
                              (window.location.href = `/dashboard/customers/${customer.id}`)
                            }
                          >
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50/30">
        <div className="text-sm text-gray-600">
          Showing {customers.length > 0 ? (currentPage - 1) * 10 + 1 : 0} to{" "}
          {Math.min(currentPage * 10, totalCustomers)} of {totalCustomers}{" "}
          results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs text-gray-600 border-gray-300 hover:bg-gray-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs text-gray-600 border-gray-300 hover:bg-gray-50"
            disabled={currentPage >= totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CustomersPage;
