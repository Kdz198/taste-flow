"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";

const IngredientCategoriesTable = dynamic(() => import("./table"), { ssr: false });
const IngredientCategoryModal = dynamic(() => import("./modal"), { ssr: false });

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken") || null;
  }
  return null;
};

interface IngredientCategory {
  id: number;
  name: string;
  description: string;
}

interface IngredientCategoryFormData {
  id?: number;
  name: string;
  description: string;
}

class IngredientCategoryApiService {
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

  static async fetchCategories(): Promise<IngredientCategory[]> {
    return this.makeRequest<IngredientCategory[]>("/ingredient-categories");
  }

  static async createCategory(categoryData: Omit<IngredientCategory, "id">): Promise<IngredientCategory> {
    return this.makeRequest<IngredientCategory>("/ingredient-categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  }

  static async updateCategory(id: number, categoryData: IngredientCategory): Promise<IngredientCategory> {
    return this.makeRequest<IngredientCategory>(`/ingredient-categories`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  }

  static async deleteCategory(id: number): Promise<{ success: boolean }> {
    return this.makeRequest<{ success: boolean }>(`/ingredient-categories/${id}`, {
      method: "DELETE",
    });
  }
}

const validateCategoryForm = (formData: IngredientCategoryFormData): string[] => {
  const errors: string[] = [];

  if (!formData.name.trim()) {
    errors.push("Category name is required");
  } else if (formData.name.trim().length < 2) {
    errors.push("Category name must be at least 2 characters long");
  }

  if (!formData.description.trim()) {
    errors.push("Description is required");
  } else if (formData.description.trim().length < 5) {
    errors.push("Description must be at least 5 characters long");
  }

  return errors;
};

export default function IngredientCategoriesPage({ initialCategories = [] }: { initialCategories?: IngredientCategory[] }) {
  const [categories, setCategories] = useState<IngredientCategory[]>(Array.isArray(initialCategories) ? initialCategories : []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IngredientCategory | null>(null);
  const [formData, setFormData] = useState<IngredientCategoryFormData>({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const loadCategories = useCallback(async () => {
    console.log("Loading ingredient categories...");
    try {
      setIsLoading(true);
      setError(null);
      const data = await IngredientCategoryApiService.fetchCategories();
      console.log("Fetched ingredient categories:", data);
      setCategories(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load ingredient categories";
      setError(errorMessage);
      console.error("Error loading ingredient categories:", error);
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
    console.log("Filtering and sorting ingredient categories...", { searchTerm, sortOrder });
    const filtered = Array.isArray(categories)
      ? categories.filter((category) => {
          if (!category || typeof category.name !== "string") {
            console.warn("Invalid category detected:", category);
            return false;
          }
          return category.name.toLowerCase().includes(searchTerm.toLowerCase());
        })
      : [];

    filtered.sort((a, b) => {
      const nameA = a.name || "";
      const nameB = b.name || "";
      const comparison = nameA.localeCompare(nameB);
      return sortOrder === "asc" ? comparison : -comparison;
    });

    console.log("Filtered ingredient categories:", filtered);
    return filtered;
  }, [categories, searchTerm, sortOrder]);

  const getStatistics = () => {
    const total = Array.isArray(categories) ? categories.length : 0;
    return { total };
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
        const categoryData: IngredientCategory = {
          id: selectedCategory.id,
          name: formData.name.trim(),
          description: formData.description.trim(),
        };
        await IngredientCategoryApiService.updateCategory(selectedCategory.id, categoryData);
      } else {
        const categoryData: Omit<IngredientCategory, "id"> = {
          name: formData.name.trim(),
          description: formData.description.trim(),
        };
        await IngredientCategoryApiService.createCategory(categoryData);
      }

      await loadCategories();
      setIsModalOpen(false);
      setFormData({ name: "", description: "" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save ingredient category";
      setError(errorMessage);
      console.error("Error saving ingredient category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: IngredientCategory) => {
    setSelectedCategory(category);
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description,
    });
    setValidationErrors([]);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this ingredient category?")) return;

    try {
      setIsLoading(true);
      setError(null);
      await IngredientCategoryApiService.deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete ingredient category";
      setError(errorMessage);
      console.error("Error deleting ingredient category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setFormData({ name: "", description: "" });
    setError(null);
    setValidationErrors([]);
  };

  const stats = getStatistics();

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <p>Total Ingredient Categories: {stats.total}</p>
        </div>
        <Button
          onClick={() => {
            setSelectedCategory(null);
            setFormData({ name: "", description: "" });
            setIsModalOpen(true);
          }}
          disabled={isLoading}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Ingredient Category
        </Button>
      </div>

      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search ingredient categories"
          className="border rounded p-2 mr-2"
        />
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")} className="border rounded p-2">
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

      <IngredientCategoriesTable
        categories={filteredCategories}
        isLoading={isLoading}
        searchTerm={searchTerm}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <IngredientCategoryModal
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
    const categories = await IngredientCategoryApiService.fetchCategories();
    console.log("getServerSideProps response:", categories);
    return {
      props: {
        initialCategories: Array.isArray(categories) ? categories : [],
      },
    };
  } catch (error) {
    console.error("Error fetching ingredient categories in getServerSideProps:", error);
    return {
      props: {
        initialCategories: [],
      },
    };
  }
}
