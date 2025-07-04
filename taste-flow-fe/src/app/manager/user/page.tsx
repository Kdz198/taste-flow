"use client";
import { userMock } from "@/app/utils/mockApi";
import { User, UserRole, UserStatus } from "@/app/utils/type";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Filter, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import UserModal from "./modal";
import UserTable from "./table";

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" || true; // Set to false when backend is ready

// Token management (replace with your auth solution)
const getAuthToken = (): string | null => {
  // Replace this with your actual token retrieval logic
  // e.g., from localStorage, cookies, or auth context
  return localStorage.getItem("authToken") || null;
  // return 'your-bearer-token-here'; // For testing
};

// API Service Layer
class UserApiService {
  private static async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken();
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData || response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return response.text() as unknown as T;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  static async fetchUsers(): Promise<User[]> {
    if (USE_MOCK_DATA) {
      // Mock implementation
      return Promise.resolve(
        userMock.map((u) => ({
          ...u,
          status: u.status as UserStatus,
          role: u.role as UserRole,
        }))
      );
    }

    // Real API implementation
    return this.makeRequest<User[]>("/api/users");
  }

  static async createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    if (USE_MOCK_DATA) {
      // Mock implementation
      return Promise.resolve({
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Real API implementation
    return this.makeRequest<User>("/api/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  static async updateUser(id: string, userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    if (USE_MOCK_DATA) {
      // Mock implementation
      return Promise.resolve({
        id,
        ...userData,
        createdAt: new Date().toISOString(), // In real API, this would come from backend
        updatedAt: new Date().toISOString(),
      });
    }

    // Real API implementation
    return this.makeRequest<User>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  static async deleteUser(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK_DATA) {
      // Mock implementation
      return Promise.resolve({ success: true });
    }

    // Real API implementation
    return this.makeRequest<{ success: boolean }>(`/api/users/${id}`, {
      method: "DELETE",
    });
  }
}

// Form validation
const validateUserForm = (formData: UserFormData): string[] => {
  const errors: string[] = [];

  if (!formData.email.trim()) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.push("Please enter a valid email address");
  }

  if (!formData.password.trim()) {
    errors.push("Password is required");
  } else if (formData.password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (!formData.name.trim()) {
    errors.push("Name is required");
  }

  if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
    errors.push("Please enter a valid phone number");
  }

  return errors;
};

// Types
interface UserFormData {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  status: UserStatus;
  role: UserRole;
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    password: "",
    name: "",
    phone: "",
    address: "",
    status: UserStatus.ACTIVE,
    role: UserRole.CUSTOMER,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, statusFilter, roleFilter, sortOrder]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await UserApiService.fetchUsers();
      setUsers(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load users";
      setError(errorMessage);
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    const filtered = users.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });

    filtered.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredUsers(filtered);
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      name: "",
      phone: "",
      address: "",
      status: UserStatus.ACTIVE,
      role: UserRole.CUSTOMER,
    });
    setValidationErrors([]);
    setSelectedUser(null);
  };

  const handleSave = async () => {
    // Validate form
    const errors = validateUserForm(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setValidationErrors([]);

      const userData = {
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        status: formData.status,
        role: formData.role,
      };

      if (selectedUser?.id) {
        // Update existing user
        const updatedUser = await UserApiService.updateUser(selectedUser.id, userData);
        setUsers(users.map((user) => (user.id === selectedUser.id ? updatedUser : user)));
      } else {
        // Create new user
        const newUser = await UserApiService.createUser(userData);
        setUsers([...users, newUser]);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save user";
      setError(errorMessage);
      console.error("Error saving user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: "", // Don't pre-fill password for security
      name: user.name,
      phone: user.phone,
      address: user.address,
      status: user.status,
      role: user.role,
    });
    setValidationErrors([]);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      setIsLoading(true);
      setError(null);
      await UserApiService.deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete user";
      setError(errorMessage);
      console.error("Error deleting user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
    setError(null);
  };

  const getStatistics = () => {
    const total = users.length;
    const active = users.filter((user) => user.status === UserStatus.ACTIVE).length;
    const managers = users.filter((user) => user.role === UserRole.MANAGER).length;
    const customers = users.filter((user) => user.role === UserRole.CUSTOMER).length;

    return { total, active, managers, customers };
  };

  const stats = getStatistics();

  // Update the statistics cards with the actual values
  useEffect(() => {
    const totalElement = document.getElementById("user-total-count");
    const activeElement = document.getElementById("user-active-count");
    const managersElement = document.getElementById("user-managers-count");
    const customersElement = document.getElementById("user-customers-count");

    if (totalElement) totalElement.textContent = stats.total.toString();
    if (activeElement) activeElement.textContent = stats.active.toString();
    if (managersElement) managersElement.textContent = stats.managers.toString();
    if (customersElement) customersElement.textContent = stats.customers.toString();
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* Header Section và Statistics Cards đã được chuyển sang layout.tsx */}

      <div className="flex justify-end">
        <Button
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-600/20 border-red-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-red-400">{error}</p>
              <Button variant="outline" size="sm" onClick={() => setError(null)}>
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#2A2A2A] border-[#3A3A3A] text-white"
              />
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-[#2A2A2A] border-[#3A3A3A] text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={UserStatus.INACTIVE}>Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32 bg-[#2A2A2A] border-[#3A3A3A] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                  <SelectItem value={UserRole.MANAGER}>Manager</SelectItem>
                  <SelectItem value={UserRole.CUSTOMER}>Customer</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="bg-[#2A2A2A] border-[#3A3A3A] hover:bg-[#3A3A3A]"
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table (tách ra component) */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="text-white">Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable
            users={users}
            filteredUsers={filteredUsers}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Modal (tách ra component) */}
      <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
        isLoading={isLoading}
        selectedUser={selectedUser}
      />
    </div>
  );
}
