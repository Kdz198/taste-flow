"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Filter, Plus, Search, User as UserIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import {User, UserRole, UserStatus} from "@/utils/type";

const UserModal = dynamic(() => import("./modal"), { ssr: false });
const UserTable = dynamic(() => import("./table"), { ssr: false });

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Hàm utility để xử lý lỗi từ API
const parseApiError = (error: unknown): string => {
  if (!error) return "Lỗi không xác định";

  const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);

  try {
    if (errorMessage.includes("{")) {
      const jsonStart = errorMessage.indexOf("{");
      const errorObj = JSON.parse(errorMessage.substring(jsonStart));

      if (errorObj.errors) {
        const specificErrors = Object.entries(errorObj.errors).map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`);
        return specificErrors.join("\n");
      } else if (errorObj.message) {
        return errorObj.message;
      }
    }
  } catch (e) {
    console.error("Error parsing error message:", e);
  }

  return errorMessage;
};

// Use imported types from @/app/utils/type.ts
interface UserFormData {
  id?: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  status: UserStatus;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

// API Service Layer
class UserApiService {
  private static async makeRequest<T>(endpoint: string, options: RequestInit = {}, retries = 3): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      "ngrok-skip-browser-warning": "true",
      "Content-Type": "application/json",
    };

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        defaultHeaders.Authorization = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, config);

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorData || response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          return (await response.json()) as T;
        }

        throw new Error("Response is not JSON");
      } catch (error) {
        if (attempt === retries) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    throw new Error("Max retries reached");
  }

  static async fetchUsers(): Promise<User[]> {
    const data = await this.makeRequest<{ success: boolean; message: string; data: User[] }>("/users");
    return Array.isArray(data.data) ? data.data : [];
  }

  static async createUser(userData: {
    email: string;
    password: string;
    name: string;
    phone: string;
    address: string;
    status: UserStatus;
    role: UserRole;
  }): Promise<User> {
    return this.makeRequest<User>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  static async updateUser(
    id: string,
    userData: {
      email: string;
      password?: string;
      name: string;
      phone: string;
      address: string;
      status: UserStatus;
      role: UserRole;
    }
  ): Promise<User> {
    return this.makeRequest<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  static async deleteUser(id: string): Promise<{ success: boolean; message?: string }> {
    return this.makeRequest<{ success: boolean; message?: string }>(`/users/${id}`, {
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

  if (!formData.id && !formData.password.trim()) {
    errors.push("Password is required for new users");
  } else if (formData.password && formData.password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (!formData.name.trim()) {
    errors.push("Name is required");
  }

  if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
    errors.push("Please enter a valid phone number");
  }

  return errors;
};

// Main Component
export default function UserPage({ initialUsers = [] }: Readonly<{ initialUsers?: User[] }>) {
  const [users, setUsers] = useState<User[]>(Array.isArray(initialUsers) ? initialUsers : []);
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

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await UserApiService.fetchUsers();
      setUsers(data);
    } catch (error) {
      const errorMessage = parseApiError(error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialUsers.length && users.length === 0) {
      loadUsers();
    }
  }, [loadUsers, initialUsers, users.length]);

  const filteredUsers = useMemo(() => {
    const filtered = Array.isArray(users)
      ? users.filter((user) => {
          if (!user || typeof user.name !== "string" || typeof user.email !== "string") return false;
          const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesStatus = statusFilter === "all" || user.status === statusFilter;
          const matchesRole = roleFilter === "all" || user.role === roleFilter;
          return matchesSearch && matchesStatus && matchesRole;
        })
      : [];

    filtered.sort((a, b) => {
      const idA = a.id || "";
      const idB = b.id || "";
      return sortOrder === "asc" ? idA.localeCompare(idB) : idB.localeCompare(idA);
    });

    return filtered;
  }, [users, searchTerm, statusFilter, roleFilter, sortOrder]);

  const getStatistics = () => {
    const total = Array.isArray(users) ? users.length : 0;
    const active = Array.isArray(users) ? users.filter((user) => user.status === UserStatus.ACTIVE).length : 0;
    const inactive = total - active;
    const managers = Array.isArray(users) ? users.filter((user) => user.role === UserRole.MANAGER).length : 0;
    const customers = Array.isArray(users) ? users.filter((user) => user.role === UserRole.CUSTOMER).length : 0;
    return { total, active, inactive, managers, customers };
  };

  const handleSave = async () => {
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
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        status: formData.status,
        role: formData.role,
        ...(formData.password && { password: formData.password }),
      };

      if (selectedUser?.id) {
        const updatedUser = await UserApiService.updateUser(selectedUser.id, userData);
        setUsers(users.map((user) => (user.id === selectedUser.id ? updatedUser : user)));
      } else {
        const newUser = await UserApiService.createUser(userData as UserFormData);
        setUsers([...users, newUser]);
      }

      await loadUsers();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      setError(parseApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      id: user.id,
      email: user.email,
      password: "",
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
    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) return;

    try {
      setIsLoading(true);
      setError(null);
      const result = await UserApiService.deleteUser(id);

      if (result.success) {
        setUsers(users.filter((user) => user.id !== id));
      } else {
        setError(result.message || "Không thể xóa người dùng. Người dùng này có thể đang được liên kết với dữ liệu khác.");
      }
    } catch (error) {
      setError(parseApiError(error));
    } finally {
      setIsLoading(false);
    }
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
    setError(null);
  };

  const stats = getStatistics();

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <p>Total Users: {stats.total}</p>
          <p>Active: {stats.active}</p>
          <p>Inactive: {stats.inactive}</p>
          <p>Managers: {stats.managers}</p>
          <p>Customers: {stats.customers}</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          disabled={isLoading}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

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

      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-orange-400" />
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable filteredUsers={filteredUsers} isLoading={isLoading} searchTerm={searchTerm} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>

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

export async function Page() {
  try {
    const users = await UserApiService.fetchUsers();
    console.log("getServerSideProps response:", users);
    return {
      props: {
        initialUsers: Array.isArray(users) ? users : [],
      },
    };
  } catch (error) {
    console.error("Error fetching data in getServerSideProps:", error);
    return {
      props: {
        initialUsers: [],
      },
    };
  }
}
