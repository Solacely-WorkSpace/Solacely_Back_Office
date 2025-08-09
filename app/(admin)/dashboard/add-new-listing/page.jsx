"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, Plus, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { listingsAPI } from "@/utils/api/listings";
import { usersAPI } from "@/utils/api/users";
import { useRouter } from "next/navigation";

function AddNewListing() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [includeRTO, setIncludeRTO] = useState(false);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState("livingRoom");

  // Refs for file inputs
  const vrVideoRef = useRef(null);
  const videoRef = useRef(null);
  const imageRef = useRef(null);

  // State for uploaded files
  const [uploadedFiles, setUploadedFiles] = useState({
    vrVideo: null,
    video: null,
    images: {
      livingRoom: [],
      bedRoom: [],
      bathRoom: [],
      kitchen: [],
      visitorBathroom: [],
    },
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    // Basic Information
    propertyTitle: "",
    propertyAddress: "",
    buildingType: "",
    propertyAvailability: "",
    agent_email: "",
    details: "",
    areaSize: "",
    bedroom: "",
    bathroom: "",
    garage: "",
    price: "",
    amenities: "",
    repairs: [],
    defects: [],
    latitude: "",
    longitude: "",

    // RTO Settings
    rentalPeriod: "",
    optionToBuyPeriod: "",
    buyOptionExpiryDate: "",
    monthlyRent: "",
    rentCredit: "",
    buyPrice: "",
    optionFee: "",
    defaultConditions: "",

    // Payment Breakdown
    lightFee: "",
    securityFee: "",
    estateDue: "",
    binContribution: "",
    additionalFees: [],
  });

  // Fetch agents when component mounts
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await usersAPI.getUsers();
        // Filter for users with is_agent=true
        const agentsList =
          response.results?.filter((user) => user.is_agent) || [];

        // If no agents found or API fails, use dummy data
        if (agentsList.length === 0) {
          const dummyAgents = [
            {
              id: "agent1",
              email: "akinrodoluseun12@gmail.com",
              full_name: "John Doe",
            },
            {
              id: "agent2",
              email: "jane.smith@solacely.com",
              full_name: "Jane Smith",
            },
            {
              id: "agent3",
              email: "michael.brown@solacely.com",
              full_name: "Michael Brown",
            },
            {
              id: "agent4",
              email: "sarah.wilson@solacely.com",
              full_name: "Sarah Wilson",
            },
            {
              id: "agent5",
              email: "david.johnson@solacely.com",
              full_name: "David Johnson",
            },
          ];
          setAgents(dummyAgents);

          // Not setting default agent email anymore
        } else {
          setAgents(agentsList);

          // Not setting default agent email anymore
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
        toast.error("Failed to load agents, using dummy data");

        // Use dummy data on error
        const dummyAgents = [
          {
            id: "agent1",
            email: "alazarashebir01@gmail.com",
            full_name: "John Doe",
          },
          {
            id: "agent2",
            email: "jane.smith@solacely.com",
            full_name: "Jane Smith",
          },
          {
            id: "agent3",
            email: "michael.brown@solacely.com",
            full_name: "Michael Brown",
          },
          {
            id: "agent4",
            email: "sarah.wilson@solacely.com",
            full_name: "Sarah Wilson",
          },
          {
            id: "agent5",
            email: "david.johnson@solacely.com",
            full_name: "David Johnson",
          },
        ];
        setAgents(dummyAgents);

        // Not setting default agent email anymore
      }
    };

    fetchAgents();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addAdditionalFee = () => {
    setFormData((prev) => ({
      ...prev,
      additionalFees: [...prev.additionalFees, { name: "", amount: "" }],
    }));
  };

  const handleFileUpload = (type, files, roomType = null) => {
    if (type === "vrVideo") {
      setUploadedFiles((prev) => ({
        ...prev,
        vrVideo: files[0],
      }));
    } else if (type === "video") {
      setUploadedFiles((prev) => ({
        ...prev,
        video: files[0],
      }));
    } else if (type === "image" && roomType) {
      setUploadedFiles((prev) => ({
        ...prev,
        images: {
          ...prev.images,
          [roomType]: [...prev.images[roomType], ...files],
        },
      }));
    }
  };

  const removeFile = (type, index, roomType = null) => {
    if (type === "vrVideo") {
      setUploadedFiles((prev) => ({
        ...prev,
        vrVideo: null,
      }));
      if (vrVideoRef.current) vrVideoRef.current.value = "";
    } else if (type === "video") {
      setUploadedFiles((prev) => ({
        ...prev,
        video: null,
      }));
      if (videoRef.current) videoRef.current.value = "";
    } else if (type === "image" && roomType) {
      setUploadedFiles((prev) => ({
        ...prev,
        images: {
          ...prev.images,
          [roomType]: prev.images[roomType].filter((_, i) => i !== index),
        },
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Check required fields and set validation errors
      const requiredFields = {
        propertyTitle: "Property Title",
        propertyAddress: "Property Address",
        buildingType: "Building Type",
        // agent_email: 'Agent', // Remove agent_email from required fields
        details: "Details",
        price: "Price",
        bedroom: "Bedroom",
        bathroom: "Bathroom",
        areaSize: "Area Size",
      };

      const errors = {};
      let hasErrors = false;

      Object.entries(requiredFields).forEach(([field, label]) => {
        if (!formData[field]) {
          errors[field] = `${label} is required`;
          hasErrors = true;
        }
      });

      // Check for image validation
      const totalImages = Object.values(uploadedFiles.images).reduce(
        (sum, images) => sum + images.length,
        0
      );

      if (totalImages < 2) {
        errors.images = "At least 2 images are required";
        hasErrors = true;
      }

      // Check description length
      if (formData.details.length < 200) {
        errors.details = "Description must be at least 200 characters";
        hasErrors = true;
      }

      setValidationErrors(errors);

      if (hasErrors) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Create FormData for the entire submission
      const formDataToSubmit = new FormData();

      // Add all listing data to FormData
      formDataToSubmit.append("title", formData.propertyTitle);
      formDataToSubmit.append("location", formData.propertyAddress);
      formDataToSubmit.append("building_type", formData.buildingType);

      // Use the selected agent email or a default if none selected
      formDataToSubmit.append(
        "agent_email",
        formData.agent_email || "akinrodoluseun12@gmail.com"
      );
      formDataToSubmit.append("description", formData.details);
      formDataToSubmit.append("price", parseFloat(formData.price));
      formDataToSubmit.append(
        "number_of_bedrooms",
        parseInt(formData.bedroom, 10)
      );
      formDataToSubmit.append(
        "number_of_bathrooms",
        parseInt(formData.bathroom, 10)
      );
      formDataToSubmit.append("area_size_sqm", parseFloat(formData.areaSize));
      formDataToSubmit.append(
        "amenities",
        formData.amenities || "None provided"
      );

      // Add arrays as JSON strings
      formDataToSubmit.append("repairs", JSON.stringify(formData.repairs));
      formDataToSubmit.append("defects", JSON.stringify(formData.defects));

      formDataToSubmit.append(
        "has_visitor_bathroom",
        uploadedFiles.images.visitorBathroom.length > 0
      );
      formDataToSubmit.append(
        "status",
        formData.propertyAvailability || "pending"
      );

      // Collect all images and their types
      const allImages = [];
      const allImageTypes = [];

      // Process all image types
      const imageCategories = [
        { files: uploadedFiles.images.livingRoom, type: "living_room" },
        { files: uploadedFiles.images.bedRoom, type: "bedroom" },
        { files: uploadedFiles.images.bathRoom, type: "bathroom" },
        { files: uploadedFiles.images.kitchen, type: "kitchen" },
        {
          files: uploadedFiles.images.visitorBathroom,
          type: "visitor_bathroom",
        },
      ];

      imageCategories.forEach((category) => {
        category.files.forEach((file) => {
          allImages.push(file);
          allImageTypes.push(category.type);
        });
      });

      // Add images as a list (not indexed)
      allImages.forEach((image) => {
        formDataToSubmit.append("uploaded_images", image);
      });

      // Add image types as a list (not indexed)
      allImageTypes.forEach((type) => {
        formDataToSubmit.append("image_types", type);
      });

      // Add VR video if available
      if (uploadedFiles.vrVideo) {
        formDataToSubmit.append("vr_video", uploadedFiles.vrVideo);
      }

      // Add regular video if available
      if (uploadedFiles.video) {
        formDataToSubmit.append("video", uploadedFiles.video);
      }

      // Add coordinates if available
      if (formData.latitude && formData.longitude) {
        formDataToSubmit.append("latitude", formData.latitude);
        formDataToSubmit.append("longitude", formData.longitude);
      }

      // Add RTO settings if enabled
      if (includeRTO) {
        formDataToSubmit.append("has_rto", true);
        formDataToSubmit.append("rental_period", formData.rentalPeriod);
        formDataToSubmit.append(
          "option_to_buy_period",
          formData.optionToBuyPeriod
        );
        formDataToSubmit.append(
          "buy_option_expiry_date",
          formData.buyOptionExpiryDate
        );
        formDataToSubmit.append("monthly_rent", formData.monthlyRent);
        formDataToSubmit.append("rent_credit", formData.rentCredit);
        formDataToSubmit.append("buy_price", formData.buyPrice);
        formDataToSubmit.append("option_fee", formData.optionFee);
        formDataToSubmit.append(
          "default_conditions",
          formData.defaultConditions
        );
      }

      // Add payment breakdown
      if (formData.lightFee)
        formDataToSubmit.append("light_fee", formData.lightFee);
      if (formData.securityFee)
        formDataToSubmit.append("security_fee", formData.securityFee);
      if (formData.estateDue)
        formDataToSubmit.append("estate_due", formData.estateDue);
      if (formData.binContribution)
        formDataToSubmit.append("bin_contribution", formData.binContribution);

      // Add additional fees
      if (formData.additionalFees.length > 0) {
        formDataToSubmit.append(
          "additional_fees",
          JSON.stringify(formData.additionalFees)
        );
      }

      // Send the entire form data in a single request
      const response = await listingsAPI.createListing(formDataToSubmit);

      if (response && response.id) {
        toast.success("Listing created successfully!");
        router.push("/dashboard/spaces/apartment");
      }
    } catch (error) {
      console.error("Error creating listing:", error);

      // Handle validation errors from the server
      if (error.response && error.response.data) {
        const serverErrors = error.response.data;
        setValidationErrors((prev) => ({
          ...prev,
          ...serverErrors,
        }));

        // Show specific error messages
        if (serverErrors.description) {
          toast.error(`Description: ${serverErrors.description[0]}`);
        }
        if (serverErrors.agent_email) {
          toast.error(`Agent: ${serverErrors.agent_email[0]}`);
        }
        if (serverErrors.uploaded_images) {
          toast.error(`Images: ${serverErrors.uploaded_images[0]}`);
        }
      } else {
        toast.error(
          "Failed to create listing: " + (error.message || "Unknown error")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Information" },
    { id: "rto", label: "RTO Settings" },
    { id: "payment", label: "Payment Breakdown" },
  ];

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/spaces/apartment">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Add New Apartment</h1>
        <div className="ml-auto flex gap-2">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "basic" && (
          <Card>
            <CardHeader>
              <CardTitle>Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="propertyTitle"
                    className={
                      validationErrors.propertyTitle ? "text-red-500" : ""
                    }
                  >
                    PROPERTY TITLE
                  </Label>
                  <Input
                    id="propertyTitle"
                    placeholder="Enter property title"
                    value={formData.propertyTitle}
                    onChange={(e) => {
                      handleInputChange("propertyTitle", e.target.value);
                      if (e.target.value) {
                        setValidationErrors((prev) => ({
                          ...prev,
                          propertyTitle: undefined,
                        }));
                      }
                    }}
                    className={
                      validationErrors.propertyTitle ? "border-red-500" : ""
                    }
                  />
                  {validationErrors.propertyTitle && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.propertyTitle}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="buildingType">BUILDING TYPE</Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("buildingType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select building type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="propertyAvailability">
                    PROPERTY AVAILABILITY
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("propertyAvailability", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="agent"
                    className={
                      validationErrors.agent_email ? "text-red-500" : ""
                    }
                  >
                    AGENT
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      handleInputChange("agent_email", value);
                      setValidationErrors((prev) => ({
                        ...prev,
                        agent_email: undefined,
                      }));
                    }}
                  >
                    <SelectTrigger
                      className={
                        validationErrors.agent_email ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.email}>
                          {agent.full_name || agent.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.agent_email && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.agent_email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label
                  htmlFor="propertyAddress"
                  className={
                    validationErrors.propertyAddress ? "text-red-500" : ""
                  }
                >
                  PROPERTY ADDRESS *
                </Label>
                <Input
                  id="propertyAddress"
                  placeholder="Enter property address"
                  value={formData.propertyAddress}
                  onChange={(e) => {
                    handleInputChange("propertyAddress", e.target.value);
                    if (e.target.value) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        propertyAddress: undefined,
                      }));
                    }
                  }}
                  className={
                    validationErrors.propertyAddress ? "border-red-500" : ""
                  }
                />
                {validationErrors.propertyAddress && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.propertyAddress}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="price">PRICE</Label>
                <Input
                  id="price"
                  placeholder="Enter property price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                />
              </div>

              <div>
                <Label
                  htmlFor="details"
                  className={validationErrors.details ? "text-red-500" : ""}
                >
                  DETAILS
                </Label>
                <Textarea
                  id="details"
                  placeholder="Enter property details"
                  value={formData.details}
                  onChange={(e) => handleInputChange("details", e.target.value)}
                  rows={4}
                  className={validationErrors.details ? "border-red-500" : ""}
                />
                <div className="flex justify-between text-sm mt-1">
                  {validationErrors.details ? (
                    <p className="text-red-500">{validationErrors.details}</p>
                  ) : (
                    <p className="text-gray-500">Minimum 200 characters</p>
                  )}
                  <p
                    className={`${
                      formData.details.length < 200
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {formData.details.length}/200 characters
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="amenities">AMENITIES</Label>
                <Textarea
                  id="amenities"
                  placeholder="Enter property amenities (e.g., WiFi, Pool, Gym)"
                  value={formData.amenities}
                  onChange={(e) =>
                    handleInputChange("amenities", e.target.value)
                  }
                  rows={3}
                />
              </div>

              {/* Image Upload Sections */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    ref={vrVideoRef}
                    accept="video/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload("vrVideo", e.target.files)
                    }
                  />
                  {!uploadedFiles.vrVideo ? (
                    <div
                      onClick={() => vrVideoRef.current?.click()}
                      className="cursor-pointer"
                    >
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">Upload VR Video</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>{uploadedFiles.vrVideo.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile("vrVideo")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    ref={videoRef}
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload("video", e.target.files)}
                  />
                  {!uploadedFiles.video ? (
                    <div
                      onClick={() => videoRef.current?.click()}
                      className="cursor-pointer"
                    >
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">Upload Video</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>{uploadedFiles.video.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile("video")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Room Type Selection */}
              <div>
                <Label>Room Types</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button
                    variant={
                      selectedRoomType === "livingRoom" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedRoomType("livingRoom")}
                  >
                    Living Room
                  </Button>
                  <Button
                    variant={
                      selectedRoomType === "bedRoom" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedRoomType("bedRoom")}
                  >
                    Bed Room
                  </Button>
                  <Button
                    variant={
                      selectedRoomType === "bathRoom" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedRoomType("bathRoom")}
                  >
                    Bath Room
                  </Button>
                  <Button
                    variant={
                      selectedRoomType === "kitchen" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedRoomType("kitchen")}
                  >
                    Kitchen
                  </Button>
                  <Button
                    variant={
                      selectedRoomType === "visitorBathroom"
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedRoomType("visitorBathroom")}
                  >
                    Visitor Bathroom
                  </Button>
                </div>
                {validationErrors.images && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.images}
                  </p>
                )}
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  ref={imageRef}
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) =>
                    handleFileUpload("image", e.target.files, selectedRoomType)
                  }
                />
                <div
                  onClick={() => imageRef.current?.click()}
                  className="cursor-pointer"
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    Upload Images of the{" "}
                    {selectedRoomType === "livingRoom"
                      ? "Living Room"
                      : selectedRoomType === "bedRoom"
                      ? "Bed Room"
                      : selectedRoomType === "bathRoom"
                      ? "Bath Room"
                      : selectedRoomType === "kitchen"
                      ? "Kitchen"
                      : "Visitor Bathroom"}
                  </p>
                </div>

                {/* Display uploaded images */}
                {uploadedFiles.images[selectedRoomType].length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {uploadedFiles.images[selectedRoomType].map(
                      (file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Room image ${index}`}
                            className="w-full h-24 object-cover rounded"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() =>
                              removeFile("image", index, selectedRoomType)
                            }
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="areaSize">AREA SIZE (SQ.M)</Label>
                  <Input
                    id="areaSize"
                    placeholder="Enter area size"
                    type="number"
                    value={formData.areaSize}
                    onChange={(e) =>
                      handleInputChange("areaSize", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="bedroom">BEDROOM</Label>
                  <Input
                    id="bedroom"
                    placeholder="Number of bedrooms"
                    type="number"
                    value={formData.bedroom}
                    onChange={(e) =>
                      handleInputChange("bedroom", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="bathroom">BATHROOM</Label>
                  <Input
                    id="bathroom"
                    placeholder="Number of bathrooms"
                    type="number"
                    value={formData.bathroom}
                    onChange={(e) =>
                      handleInputChange("bathroom", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="garage">GARAGE</Label>
                  <Input
                    id="garage"
                    placeholder="Enter garage details"
                    value={formData.garage}
                    onChange={(e) =>
                      handleInputChange("garage", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Home Details */}
              <div>
                <Label>REPAIRS</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {formData.repairs.map((repair, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={repair}
                        onChange={(e) => {
                          const newRepairs = [...formData.repairs];
                          newRepairs[index] = e.target.value;
                          handleInputChange("repairs", newRepairs);
                        }}
                        className="text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newRepairs = formData.repairs.filter(
                            (_, i) => i !== index
                          );
                          handleInputChange("repairs", newRepairs);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add repair"
                      className="text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                          e.preventDefault();
                          handleInputChange("repairs", [
                            ...formData.repairs,
                            e.target.value.trim(),
                          ]);
                          e.target.value = "";
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousSibling;
                        if (input.value.trim()) {
                          handleInputChange("repairs", [
                            ...formData.repairs,
                            input.value.trim(),
                          ]);
                          input.value = "";
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Home Directs */}
              <div>
                <Label>DEFECTS</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {formData.defects.map((defect, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={defect}
                        onChange={(e) => {
                          const newDefects = [...formData.defects];
                          newDefects[index] = e.target.value;
                          handleInputChange("defects", newDefects);
                        }}
                        className="text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newDefects = formData.defects.filter(
                            (_, i) => i !== index
                          );
                          handleInputChange("defects", newDefects);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add defect"
                      className="text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                          e.preventDefault();
                          handleInputChange("defects", [
                            ...formData.defects,
                            e.target.value.trim(),
                          ]);
                          e.target.value = "";
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousSibling;
                        if (input.value.trim()) {
                          handleInputChange("defects", [
                            ...formData.defects,
                            input.value.trim(),
                          ]);
                          input.value = "";
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Keep the existing RTO and Payment tabs unchanged */}
        {activeTab === "rto" && (
          <Card>
            <CardHeader>
              <CardTitle>Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* RTO Toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="includeRTO" className="text-base font-medium">
                  INCLUDE RENT TO OWN MODEL FOR THIS PROPERTY
                </Label>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="includeRTO"
                    checked={includeRTO}
                    onChange={(e) => setIncludeRTO(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    onClick={() => setIncludeRTO(!includeRTO)}
                    className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
                      includeRTO ? "bg-[#521282]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        includeRTO ? "translate-x-6" : "translate-x-0.5"
                      } mt-0.5`}
                    />
                  </div>
                </div>
              </div>

              {includeRTO && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="rentalPeriod">
                        RENTAL PERIOD (Months)
                      </Label>
                      <Input
                        id="rentalPeriod"
                        placeholder="E.g 36"
                        value={formData.rentalPeriod}
                        onChange={(e) =>
                          handleInputChange("rentalPeriod", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="optionToBuyPeriod">
                        OPTION TO BUY PERIOD (Months)
                      </Label>
                      <Input
                        id="optionToBuyPeriod"
                        placeholder="E.g 36"
                        value={formData.optionToBuyPeriod}
                        onChange={(e) =>
                          handleInputChange("optionToBuyPeriod", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="buyOptionExpiryDate">
                        BUY OPTION EXPIRY DATE
                      </Label>
                      <Input
                        id="buyOptionExpiryDate"
                        type="date"
                        value={formData.buyOptionExpiryDate}
                        onChange={(e) =>
                          handleInputChange(
                            "buyOptionExpiryDate",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="monthlyRent">MONTHLY RENT</Label>
                      <Input
                        id="monthlyRent"
                        placeholder="Enter price"
                        value={formData.monthlyRent}
                        onChange={(e) =>
                          handleInputChange("monthlyRent", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="rentCredit">RENT CREDIT (%)</Label>
                      <Input
                        id="rentCredit"
                        placeholder="Enter value"
                        value={formData.rentCredit}
                        onChange={(e) =>
                          handleInputChange("rentCredit", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="buyPrice">BUY PRICE</Label>
                      <Input
                        id="buyPrice"
                        placeholder="Enter price"
                        value={formData.buyPrice}
                        onChange={(e) =>
                          handleInputChange("buyPrice", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="optionFee">OPTION FEE</Label>
                    <Input
                      id="optionFee"
                      placeholder="Enter amount"
                      value={formData.optionFee}
                      onChange={(e) =>
                        handleInputChange("optionFee", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="defaultConditions">
                      DEFAULT & TERMINATION CONDITIONS
                    </Label>
                    <Textarea
                      id="defaultConditions"
                      placeholder="Enter conditions"
                      value={formData.defaultConditions}
                      onChange={(e) =>
                        handleInputChange("defaultConditions", e.target.value)
                      }
                      rows={4}
                    />
                  </div>

                  {/* Maintenance & Repairs */}
                  <div>
                    <Label className="text-base font-medium">
                      MAINTENANCE & REPAIRS
                    </Label>
                    <div className="flex gap-6 mt-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span>LandLord</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded"
                          defaultChecked
                        />
                        <span>Tenant</span>
                      </label>
                    </div>
                  </div>

                  {/* Property Insurance */}
                  <div>
                    <Label className="text-base font-medium">
                      PROPERTY INSURANCE
                    </Label>
                    <div className="flex gap-6 mt-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span>LandLord</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded"
                          defaultChecked
                        />
                        <span>Tenant</span>
                      </label>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "payment" && (
          <Card>
            <CardHeader>
              <CardTitle>Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="lightFee">LIGHT FEE</Label>
                  <Input
                    id="lightFee"
                    placeholder="Enter property title"
                    value={formData.lightFee}
                    onChange={(e) =>
                      handleInputChange("lightFee", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="securityFee">SECURITY FEE</Label>
                  <Input
                    id="securityFee"
                    placeholder="Enter price"
                    value={formData.securityFee}
                    onChange={(e) =>
                      handleInputChange("securityFee", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="estateDue">ESTATE DUE</Label>
                  <Input
                    id="estateDue"
                    placeholder="Enter price"
                    value={formData.estateDue}
                    onChange={(e) =>
                      handleInputChange("estateDue", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="binContribution">BIN CONTRIBUTION</Label>
                  <Input
                    id="binContribution"
                    placeholder="Enter price"
                    value={formData.binContribution}
                    onChange={(e) =>
                      handleInputChange("binContribution", e.target.value)
                    }
                  />
                </div>
              </div>

              <Button variant="outline" onClick={addAdditionalFee}>
                <Plus className="h-4 w-4 mr-2" />
                Add more
              </Button>

              {/* Additional Fees */}
              {formData.additionalFees.map((fee, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <Input
                    placeholder="Fee name"
                    value={fee.name}
                    onChange={(e) => {
                      const newFees = [...formData.additionalFees];
                      newFees[index].name = e.target.value;
                      handleInputChange("additionalFees", newFees);
                    }}
                  />
                  <Input
                    placeholder="Amount"
                    value={fee.amount}
                    onChange={(e) => {
                      const newFees = [...formData.additionalFees];
                      newFees[index].amount = e.target.value;
                      handleInputChange("additionalFees", newFees);
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default AddNewListing;
