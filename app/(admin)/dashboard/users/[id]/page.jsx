"use client";
import React, { useEffect, useState } from "react";
import { usersAPI } from "@/utils/api/users";
import { adminAPI } from "@/utils/api/admin";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Activity,
  Trash2,
  Edit,
  UserCheck,
  UserX,
  Building,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

function UserDetailView({ params }) {
  const [userDetail, setUserDetail] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getUserDetail();
    getUserActivities();
  }, [params.id]);

  const getUserDetail = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUser(params.id);
      setUserDetail(response.data);
    } catch (err) {
      console.error("Error fetching user:", err);
      toast.error("Error fetching user details");
      setError("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  const getUserActivities = async () => {
    try {
      setActivityLoading(true);
      const response = await adminAPI.getUserActivities({ user_id: params.id });
      setActivities(response.data.results || []);
    } catch (err) {
      console.error("Error fetching user activities:", err);
      toast.error("Error fetching user activities");
    } finally {
      setActivityLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      await adminAPI.updateUserStatus(params.id, status);
      toast.success(`User status updated to ${status}`);
      getUserDetail(); // Refresh user details
    } catch (err) {
      console.error("Error updating user status:", err);
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteUser = async () => {
    try {
      await usersAPI.deleteUser(params.id);
      toast.success("User deleted successfully");
      router.push("/dashboard/users");
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="h-9 w-9 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Loading User Details...</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="bg-gray-50">
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-4 bg-gray-100 rounded w-full"></div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="h-9 w-9 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">User Details</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-medium text-red-600 mb-2">Error</h2>
              <p className="text-gray-600">{error}</p>
              <Button
                onClick={() => getUserDetail()}
                className="mt-4 bg-[#521282] hover:bg-purple-700 text-white"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="h-9 w-9 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">User Details</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="border-purple-200 text-purple-600 hover:bg-purple-50 flex items-center gap-2"
            onClick={() => router.push(`/dashboard/users/edit/${params.id}`)}
          >
            <Edit className="h-4 w-4" />
            Edit User
          </Button>
          {userDetail?.account_status === "ACTIVE" ? (
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-2"
              onClick={() => handleUpdateStatus("INACTIVE")}
            >
              <UserX className="h-4 w-4" />
              Deactivate
            </Button>
          ) : (
            <Button
              variant="outline"
              className="border-green-200 text-green-600 hover:bg-green-50 flex items-center gap-2"
              onClick={() => handleUpdateStatus("ACTIVE")}
            >
              <UserCheck className="h-4 w-4" />
              Activate
            </Button>
          )}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
              </DialogHeader>
              <p className="text-gray-600 py-4">
                This action cannot be undone. This will permanently delete the user account
                and all associated data.
              </p>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteUser}
                >
                  Delete User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Basic Information */}
        <Card className="md:col-span-1">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-medium">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={userDetail?.profile_image} alt={userDetail?.full_name} />
                <AvatarFallback className="bg-purple-100 text-purple-600 text-xl">
                  {userDetail?.full_name
                    ? userDetail.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : userDetail?.email.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold text-gray-900">{userDetail?.full_name || "N/A"}</h2>
              <Badge
                className={`mt-2 ${userDetail?.account_status === "ACTIVE" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-red-100 text-red-800 hover:bg-red-100"}`}
              >
                {userDetail?.account_status || "INACTIVE"}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Username</p>
                  <p className="text-gray-900">{userDetail?.username || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{userDetail?.email}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">{userDetail?.phone_number || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <p className="text-gray-900">
                    {userDetail?.is_staff
                      ? "Admin"
                      : userDetail?.is_landlord
                      ? "Landlord"
                      : userDetail?.is_tenant
                      ? "Tenant"
                      : userDetail?.is_agent
                      ? "Agent"
                      : "User"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right column - Account Information */}
        <Card className="md:col-span-2">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-medium">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date Joined</p>
                  <p className="text-gray-900">
                    {userDetail?.date_joined
                      ? new Date(userDetail.date_joined).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Login</p>
                  <p className="text-gray-900">
                    {userDetail?.last_login
                      ? new Date(userDetail.last_login).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Never"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Verified</p>
                  <p className="text-gray-900">
                    {userDetail?.is_email_verified ? "Yes" : "No"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-900">{userDetail?.location || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-gray-900">{userDetail?.address || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Bio</p>
                  <p className="text-gray-900">{userDetail?.bio || "N/A"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenant-specific information (if user is a tenant) */}
        {userDetail?.is_tenant && (
          <Card className="md:col-span-3">
            <CardHeader className="bg-gray-50 border-b flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Tenant Information</CardTitle>
              <Button
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
                onClick={() => router.push(`/dashboard/customers/${params.id}`)}
              >
                View in Customer Section
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-4">
                <p className="text-gray-600">
                  For detailed tenant information including wallet balance, linked apartments, and payment history,
                  please view this user in the Customer section.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Activity */}
        <Card className="md:col-span-3">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-medium">User Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {activityLoading ? (
              <div className="space-y-4 p-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-100 animate-pulse rounded-md"
                  ></div>
                ))}
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No activity records found for this user</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-700">Action</th>
                      <th className="text-left p-4 font-medium text-gray-700">Timestamp</th>
                      <th className="text-left p-4 font-medium text-gray-700">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((activity) => (
                      <tr
                        key={activity.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 text-gray-700">{activity.action}</td>
                        <td className="p-4 text-gray-700">
                          {new Date(activity.timestamp).toLocaleString()}
                        </td>
                        <td className="p-4 text-gray-700">
                          {activity.meta && (
                            <pre className="text-xs overflow-x-auto max-w-xs">
                              {JSON.stringify(activity.meta, null, 2)}
                            </pre>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UserDetailView;