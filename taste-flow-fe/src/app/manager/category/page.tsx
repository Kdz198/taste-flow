"use client";
import { categoryMock } from "@/app/utils/mockApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import CategoryModal from "./modal";
import CategoryTable from "./table";

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
      {/* Header Section đã được chuyển sang layout.tsx */}
      <div className="flex justify-end">
        <Button
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
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

      {/* Categories Table (tách ra component) */}
      <CategoryTable
        categories={filteredCategories}
        isLoading={isLoading}
        searchTerm={searchTerm}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* Modal (tách ra component) */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
        isLoading={isLoading}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}
