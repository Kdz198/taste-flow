"use client";
import { categoryMock } from "@/app/utils/mockApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Edit2, Eye, Filter, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" || true; // Set to false when backend is ready

// Token management (replace with your auth solution)
const getAuthToken = (): string | null => {
  // Replace this with your actual token retrieval logic
  return localStorage.getItem("authToken") || null;
  // return 'your-bearer-token-here'; // For testing
};

// Types
interface Category {
  id: string;
  name: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryFormData {
  name: string;
  status: boolean;
}

// API Service Layer
class CategoryApiService {
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

  static async fetchCategories(): Promise<Category[]> {
    if (USE_MOCK_DATA) {
      // Mock implementation
      return Promise.resolve(
        categoryMock.map((cat) => ({
          ...cat,
          status: cat.status ?? true, // Normalize data
        }))
      );
    }

    // Real API implementation
    return this.makeRequest<Category[]>("/api/categories");
  }

  static async createCategory(categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<Category> {
    if (USE_MOCK_DATA) {
      // Mock implementation
      return Promise.resolve({
        id: Date.now().toString(),
        ...categoryData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Real API implementation
    return this.makeRequest<Category>("/api/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  }

  static async updateCategory(id: string, categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<Category> {
    if (USE_MOCK_DATA) {
      // Mock implementation
      return Promise.resolve({
        id,
        ...categoryData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Real API implementation
    return this.makeRequest<Category>(`/api/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  }

  static async deleteCategory(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK_DATA) {
      // Mock implementation
      return Promise.resolve({ success: true });
    }

    // Real API implementation
    return this.makeRequest<{ success: boolean }>(`/api/categories/${id}`, {
      method: "DELETE",
    });
  }
}

// Form validation
const validateCategoryForm = (formData: CategoryFormData): string[] => {
  const errors: string[] = [];

  if (!formData.name.trim()) {
    errors.push("Category name is required");
  } else if (formData.name.trim().length < 2) {
    errors.push("Category name must be at least 2 characters long");
  }

  return errors;
};

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    status: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    filterAndSortCategories();
  }, [categories, searchTerm, statusFilter, sortOrder]);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await CategoryApiService.fetchCategories();
      setCategories(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load categories";
      setError(errorMessage);
      console.error("Error loading categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortCategories = () => {
    const filtered = categories.filter((category) => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || (statusFilter === "active" && category.status) || (statusFilter === "inactive" && !category.status);

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredCategories(filtered);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      status: true,
    });
    setValidationErrors([]);
    setSelectedCategory(null);
  };

  const handleSave = async () => {
    // Validate form
    const errors = validateCategoryForm(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setValidationErrors([]);

      const categoryData = {
        name: formData.name.trim(),
        status: formData.status,
      };

      if (selectedCategory?.id) {
        // Update existing category
        const updatedCategory = await CategoryApiService.updateCategory(selectedCategory.id, categoryData);
        setCategories(categories.map((cat) => (cat.id === selectedCategory.id ? updatedCategory : cat)));
      } else {
        // Create new category
        const newCategory = await CategoryApiService.createCategory(categoryData);
        setCategories([...categories, newCategory]);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save category";
      setError(errorMessage);
      console.error("Error saving category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      status: category.status ?? true,
    });
    setValidationErrors([]);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      setIsLoading(true);
      setError(null);
      await CategoryApiService.deleteCategory(id);
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete category";
      setError(errorMessage);
      console.error("Error deleting category:", error);
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
    const total = categories.length;
    const active = categories.filter((cat) => cat.status).length;
    const inactive = total - active;

    return { total, active, inactive };
  };

  const stats = getStatistics();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Category Management</h1>
          <p className="text-gray-400 mt-1">Manage your food categories and organize your menu</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Total Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Active Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-400">{stats.active}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Inactive Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-400">{stats.inactive}</p>
          </CardContent>
        </Card>
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
                placeholder="Search categories..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
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

      {/* Categories Table */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="text-white">Categories ({filteredCategories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && !categories.length ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-400">Loading categories...</div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No categories found</p>
              {searchTerm && <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filter criteria</p>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2A2A2A]">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">ID</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="border-b border-[#2A2A2A] hover:bg-[#2A2A2A]/50 transition-colors">
                      <td className="py-4 px-4 text-gray-300 font-mono text-sm">{category.id}</td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-white">{category.name}</div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={category.status ? "default" : "secondary"}>{category.status ? "Active" : "Inactive"}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(category)}
                            disabled={isLoading}
                            className="bg-[#2A2A2A] border-[#3A3A3A] hover:bg-[#3A3A3A]"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)} disabled={isLoading}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedCategory?.id ? "Edit Category" : "Add New Category"} className="max-w-lg">
        <div className="space-y-6">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Card className="bg-red-600/20 border-red-600">
              <CardContent className="pt-4">
                <ul className="text-red-400 text-sm space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white">
                Category Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
                className="mt-1 bg-[#2A2A2A] border-[#3A3A3A] text-white"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label className="text-white">Status</Label>
              <Select
                value={formData.status ? "active" : "inactive"}
                onValueChange={(value) => setFormData({ ...formData, status: value === "active" })}
                disabled={isLoading}
              >
                <SelectTrigger className="mt-1 bg-[#2A2A2A] border-[#3A3A3A] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
            <Button variant="outline" onClick={handleCloseModal} disabled={isLoading} className="bg-[#2A2A2A] border-[#3A3A3A] hover:bg-[#3A3A3A]">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || !formData.name.trim()}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              {isLoading ? "Saving..." : selectedCategory?.id ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
