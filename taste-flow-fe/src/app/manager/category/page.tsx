"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";

const CategoryTable = dynamic(() => import("./table"), { ssr: false });
const CategoryModal = dynamic(() => import("./modal"), { ssr: false });

const API_BASE_URL = "https://1654eacd2cd1.ngrok-free.app";

const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken") || null;
  }
  return null;
};

interface Category {
  id: string;
  name: string;
  status: boolean;
}

interface CategoryFormData {
  id?: string;
  name: string;
  status: boolean;
}

class CategoryApiService {
  private static async makeRequest<T>(endpoint: string, options: RequestInit = {}, retries = 3): Promise<T> {
    const token = getAuthToken();
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      "ngrok-skip-browser-warning": "true",
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

    console.log(`Making request to ${url} with headers:`, config.headers);

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, config);

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorData || response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log(`API response for ${endpoint}:`, data);
          return data as T;
        }

        throw new Error("Response is not JSON");
      } catch (error) {
        if (attempt === retries) throw error;
        console.log(`Retrying request to ${endpoint} (Attempt ${attempt + 1}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    throw new Error("Max retries reached");
  }

  static async fetchCategories(): Promise<Category[]> {
    const data = await this.makeRequest<{ response: { data: Category[] } }>("/api/categories");
    return Array.isArray(data.response.data) ? data.response.data : [];
  }

  static async createCategory(categoryData: Omit<Category, "id">): Promise<Category> {
    return this.makeRequest<Category>("/api/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  }

  static async updateCategory(id: string, categoryData: Category): Promise<Category> {
    return this.makeRequest<Category>(`/api/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  }

  static async deleteCategory(id: string): Promise<{ success: boolean }> {
    return this.makeRequest<{ success: boolean }>(`/api/categories/${id}`, {
      method: "DELETE",
    });
  }
}

const validateCategoryForm = (formData: CategoryFormData): string[] => {
  const errors: string[] = [];

  if (!formData.name.trim()) {
    errors.push("Category name is required");
  } else if (formData.name.trim().length < 2) {
    errors.push("Category name must be at least 2 characters long");
  }

  return errors;
};

export default function CategoryPage({ initialCategories = [] }: { initialCategories?: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(Array.isArray(initialCategories) ? initialCategories : []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    id: "",
    name: "",
    status: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const loadCategories = useCallback(async () => {
    console.log("Loading categories...");
    try {
      setIsLoading(true);
      setError(null);
      const data = await CategoryApiService.fetchCategories();
      console.log("Fetched categories:", data);
      setCategories(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load categories";
      setError(errorMessage);
      console.error("Error loading categories:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("Checking initialCategories:", initialCategories);
    if (!initialCategories.length && categories.length === 0) {
      loadCategories();
    }
  }, [loadCategories]);

  const filteredCategories = useMemo(() => {
    console.log("Filtering and sorting categories...", { searchTerm, statusFilter, sortOrder });
    const filtered = Array.isArray(categories)
      ? categories.filter((category) => {
          if (!category || typeof category.name !== "string") {
            console.warn("Invalid category detected:", category);
            return false;
          }
          const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesStatus =
            statusFilter === "all" || (statusFilter === "active" && category.status) || (statusFilter === "inactive" && !category.status);
          return matchesSearch && matchesStatus;
        })
      : [];

    filtered.sort((a, b) => {
      const nameA = a.name || "";
      const nameB = b.name || "";
      const comparison = nameA.localeCompare(nameB);
      return sortOrder === "asc" ? comparison : -comparison;
    });

    console.log("Filtered categories:", filtered);
    return filtered;
  }, [categories, searchTerm, statusFilter, sortOrder]);

  const getStatistics = () => {
    const total = Array.isArray(categories) ? categories.length : 0;
    const active = Array.isArray(categories) ? categories.filter((cat) => cat.status).length : 0;
    const inactive = total - active;
    return { total, active, inactive };
  };

  const handleSave = async () => {
    const errors = validateCategoryForm(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setValidationErrors([]);

      if (selectedCategory?.id) {
        const categoryData: Category = {
          id: selectedCategory.id,
          name: formData.name.trim(),
          status: formData.status,
        };
        await CategoryApiService.updateCategory(selectedCategory.id, categoryData);
      } else {
        const categoryData: Omit<Category, "id"> = {
          name: formData.name.trim(),
          status: formData.status,
        };
        await CategoryApiService.createCategory(categoryData);
      }

      await loadCategories(); // Refetch categories after save
      setIsModalOpen(false);
      setFormData({ name: "", status: true });
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
      id: category.id,
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
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
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
    setSelectedCategory(null);
    setFormData({ name: "", status: true });
    setError(null);
    setValidationErrors([]);
  };

  const stats = getStatistics();

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <p>Total Categories: {stats.total}</p>
          <p>Active: {stats.active}</p>
          <p>Inactive: {stats.inactive}</p>
        </div>
        <Button
          onClick={() => {
            setSelectedCategory(null);
            setFormData({ name: "", status: true });
            setIsModalOpen(true);
          }}
          disabled={isLoading}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div>
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search categories" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
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

      <CategoryTable
        categories={filteredCategories}
        isLoading={isLoading}
        searchTerm={searchTerm}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

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

export async function Page() {
  try {
    const categories = await CategoryApiService.fetchCategories();
    console.log("getServerSideProps response:", categories);
    return {
      props: {
        initialCategories: Array.isArray(categories) ? categories : [],
      },
    };
  } catch (error) {
    console.error("Error fetching categories in getServerSideProps:", error);
    return {
      props: {
        initialCategories: [],
      },
    };
  }
}
