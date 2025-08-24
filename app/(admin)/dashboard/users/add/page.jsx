"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Eye, EyeOff, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { adminAPI } from "@/utils/api/admin";
import { toast } from "react-hot-toast";

function AddNewUser() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    company_position: "",
    password: "",
    password_confirm: "",
    role: "user",
    send_email: false,
    phone_number: "",
    location: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create form data for multipart/form-data request
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'password_confirm') { // Don't send password_confirm to backend
          submitData.append(key, formData[key]);
        }
      });
      
      // Add profile image if exists
      if (profileImage) {
        submitData.append('profile_image', profileImage);
      }

      // Send request to create user
      const response = await adminAPI.createUser(submitData);
      
      toast.success("User created successfully!");
      router.push("/dashboard/users");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">User Management</h1>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Add New User</h2>
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go back
          </button>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700"
                >
                  USERNAME*
                </Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  className="h-12"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  EMAIL*
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-12"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="full_name"
                  className="text-sm font-medium text-gray-700"
                >
                  FULL NAME
                </Label>
                <Input
                  id="full_name"
                  placeholder="Enter full name"
                  value={formData.full_name}
                  onChange={(e) =>
                    handleInputChange("full_name", e.target.value)
                  }
                  className="h-12"
                  required
                />
              </div>

              {/* Company Position */}
              <div className="space-y-2">
                <Label
                  htmlFor="company_position"
                  className="text-sm font-medium text-gray-700"
                >
                  COMPANY POSITION
                </Label>
                <Input
                  id="company_position"
                  placeholder="Enter position"
                  value={formData.company_position}
                  onChange={(e) =>
                    handleInputChange("company_position", e.target.value)
                  }
                  className="h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone Number */}
              <div className="space-y-2">
                <Label
                  htmlFor="phone_number"
                  className="text-sm font-medium text-gray-700"
                >
                  PHONE NUMBER
                </Label>
                <Input
                  id="phone_number"
                  placeholder="Enter phone number"
                  value={formData.phone_number}
                  onChange={(e) =>
                    handleInputChange("phone_number", e.target.value)
                  }
                  className="h-12"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-sm font-medium text-gray-700"
                >
                  LOCATION
                </Label>
                <Input
                  id="location"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="h-12"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  PASSWORD
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="h-12 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="password_confirm"
                  className="text-sm font-medium text-gray-700"
                >
                  CONFIRM PASSWORD
                </Label>
                <Input
                  id="password_confirm"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.password_confirm}
                  onChange={(e) =>
                    handleInputChange("password_confirm", e.target.value)
                  }
                  className="h-12"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role */}
              <div className="space-y-2">
                <Label
                  htmlFor="role"
                  className="text-sm font-medium text-gray-700"
                >
                  ROLE
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Profile Image
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  id="profile_image"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="profile_image" className="cursor-pointer">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Upload className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {profileImage ? profileImage.name : "Drop your image here, or browse"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Supports JPG, PNG, and JPEG
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Send Email Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="send_email"
                checked={formData.send_email}
                onChange={(e) =>
                  handleInputChange("send_email", e.target.checked)
                }
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <Label htmlFor="send_email" className="text-sm text-gray-700">
                Send the new user an email about their account.
              </Label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="bg-[#521282] hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Creating User..." : "Add New User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewUser;
