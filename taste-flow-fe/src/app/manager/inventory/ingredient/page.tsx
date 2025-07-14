"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Filter, Grid3X3, List, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";

const IngredientModal = dynamic(() => import("./modal"), { ssr: false });
const IngredientTable = dynamic(() => import("./table"), { ssr: false });

const API_BASE_URL = "https://1654eacd2cd1.ngrok-free.app";

const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken") || null;
  }
  return null;
};
// Hàm utility để xử lý lỗi từ API
const parseApiError = (error: unknown): string => {
  if (!error) return "Lỗi không xác định";

  const errorMessage = error instanceof Error ? error.message : String(error);

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

// Types
interface Category {
  id: number;
  name: string;
  description: string;
}

interface Ingredient {
  id: number;
  name: string;
  category: Category;
  unit: string;
}

interface IngredientFormData {
  id?: number;
  name: string;
  category: number;
  unit: string;
}

// API Service Layer
class IngredientApiService {
  private static async makeRequest<T>(endpoint: string, options: RequestInit = {}, retries = 3): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      "ngrok-skip-browser-warning": "true",
      "Content-Type": "application/json",
    };

    if (typeof window !== "undefined") {
      const token = getAuthToken();
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
    console.log(`Making request to ${url} with headers:`, config.headers);

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
        console.log(`Retrying request to ${endpoint} (Attempt ${attempt + 1}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    throw new Error("Max retries reached");
  }

  static async fetchIngredients(): Promise<Ingredient[]> {
    const data = await this.makeRequest<Ingredient[]>("/api/ingredients", {}, 1); // Chỉ gọi 1 lần
    console.log("Fetched ingredients:", data);
    return Array.isArray(data) ? data : [];
  }

  static async fetchIngredientCategories(): Promise<Category[]> {
    try {
      const data = await this.makeRequest<Category[]>("/api/ingredient-categories", {}, 1); // Chỉ gọi 1 lần
      if (!Array.isArray(data)) {
        console.error("Invalid response format from API:", data);
        return [];
      }
      return data;
    } catch (error) {
      console.error("Error fetching ingredient categories:", error instanceof Error ? error.message : error);
      return [];
    }
  }

  static async createIngredient(ingredientData: { name: string; category: { id: number }; unit: string }): Promise<Ingredient> {
    return this.makeRequest<Ingredient>("/api/ingredients", {
      method: "POST",
      body: JSON.stringify(ingredientData),
    });
  }

  static async updateIngredient(
    id: number,
    ingredientData: {
      id: number;
      name: string;
      category: { id: number };
      unit: string;
    }
  ): Promise<Ingredient> {
    return this.makeRequest<Ingredient>(`/api/ingredients`, {
      method: "POST",
      body: JSON.stringify(ingredientData),
    });
  }

  static async deleteIngredient(id: number): Promise<{ success: boolean; message?: string }> {
    try {
      return this.makeRequest<{ success: boolean; message?: string }>(`/api/ingredients/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error deleting ingredient:", error.message);
      }
      throw error;
    }
  }
}

// Form validation
const validateIngredientForm = (formData: IngredientFormData): string[] => {
  const errors: string[] = [];

  if (!formData.name.trim()) {
    errors.push("Ingredient name is required");
  } else if (formData.name.trim().length < 2) {
    errors.push("Ingredient name must be at least 2 characters long");
  }

  if (formData.category <= 0) {
    errors.push("A category is required");
  }

  if (!formData.unit.trim()) {
    errors.push("Unit is required");
  }

  return errors;
};

// Main Component
export default function IngredientPage({
  initialIngredients = [],
  initialIngredientCategories = [],
}: Readonly<{
  initialIngredients?: Ingredient[];
  initialIngredientCategories?: Category[];
}>) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(Array.isArray(initialIngredients) ? initialIngredients : []);
  const [ingredientCategories, setIngredientCategories] = useState<Category[]>(
    Array.isArray(initialIngredientCategories) ? initialIngredientCategories : []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [formData, setFormData] = useState<IngredientFormData>({
    name: "",
    category: 0,
    unit: "GRAM",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [hasFetchedIngredients, setHasFetchedIngredients] = useState(false);
  const [hasFetchedCategories, setHasFetchedCategories] = useState(false);

  const loadIngredients = useCallback(async () => {
    if (hasFetchedIngredients) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await IngredientApiService.fetchIngredients();
      setIngredients(data);
      setHasFetchedIngredients(true);
    } catch (error) {
      const errorMessage = parseApiError(error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [hasFetchedIngredients]);

  const loadIngredientCategories = useCallback(async () => {
    if (hasFetchedCategories) return;
    try {
      const data = await IngredientApiService.fetchIngredientCategories();
      setIngredientCategories(data);
      setHasFetchedCategories(true);
    } catch (error) {
      console.error("Error loading ingredient categories:", error);
    }
  }, [hasFetchedCategories]);

  useEffect(() => {
    console.log("useEffect triggered", {
      initialIngredientsLength: initialIngredients.length,
      ingredientsLength: ingredients.length,
      hasFetchedIngredients,
      initialCategoriesLength: initialIngredientCategories.length,
      categoriesLength: ingredientCategories.length,
      hasFetchedCategories,
    });
    if (!initialIngredients.length && !hasFetchedIngredients) {
      console.log("Calling loadIngredients");
      loadIngredients();
    }
    if (!initialIngredientCategories.length && !hasFetchedCategories) {
      console.log("Calling loadIngredientCategories");
      loadIngredientCategories();
    }
  }, [loadIngredients, loadIngredientCategories, initialIngredients, initialIngredientCategories, hasFetchedIngredients, hasFetchedCategories]);

  const filteredIngredients = useMemo(() => {
    const filtered = Array.isArray(ingredients)
      ? ingredients.filter((ingredient) => {
          if (!ingredient || !ingredient.name || !ingredient.category) return false;
          const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCategory = categoryFilter === "all" || ingredient.category.id.toString() === categoryFilter;
          return matchesSearch && matchesCategory;
        })
      : [];

    filtered.sort((a, b) => {
      const idA = a.id || 0;
      const idB = b.id || 0;
      return sortOrder === "asc" ? idA - idB : idB - idA;
    });

    return filtered;
  }, [ingredients, searchTerm, categoryFilter, sortOrder]);

  const getStatistics = () => {
    const total = Array.isArray(ingredients) ? ingredients.length : 0;
    return { total };
  };

  const handleSave = async () => {
    const errors = validateIngredientForm(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setValidationErrors([]);

      if (selectedIngredient?.id) {
        // PUT payload for edit
        const ingredientData = {
          id: selectedIngredient.id,
          name: formData.name.trim(),
          category: { id: formData.category },
          unit: formData.unit,
        };
        const updatedIngredient = await IngredientApiService.updateIngredient(selectedIngredient.id, ingredientData);
        setIngredients(ingredients.map((ing) => (ing.id === selectedIngredient.id ? updatedIngredient : ing)));
      } else {
        // POST payload for add
        const ingredientData = {
          name: formData.name.trim(),
          category: { id: formData.category },
          unit: formData.unit,
        };
        const newIngredient = await IngredientApiService.createIngredient(ingredientData);
        setIngredients([...ingredients, newIngredient]);
      }

      await loadIngredients();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      setError(parseApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setFormData({
      id: ingredient.id,
      name: ingredient.name,
      category: ingredient.category.id,
      unit: ingredient.unit,
    });
    setValidationErrors([]);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nguyên liệu này không?")) return;

    try {
      setIsLoading(true);
      setError(null);
      const result = await IngredientApiService.deleteIngredient(id);

      if (result.success) {
        setIngredients(ingredients.filter((ing) => ing.id !== id));
      } else {
        setError(result.message || "Không thể xóa nguyên liệu. Nguyên liệu này có thể đang được sử dụng.");
      }
    } catch (error) {
      setError(parseApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: 0,
      unit: "GRAM",
    });
    setValidationErrors([]);
    setSelectedIngredient(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
    setError(null);
  };

  const getCategoryName = (categoryId: number): string => {
    const category = ingredientCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  const stats = getStatistics();

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <p>Total Ingredients: {stats.total}</p>
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
          Add New Ingredient
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
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Input
                  placeholder="Search ingredients by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#2A2A2A] border-[#3A3A3A] text-white"
                />
              </div>

              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-36 bg-[#2A2A2A] border-[#3A3A3A] text-white">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                    <SelectItem value="all">All Categories</SelectItem>
                    {ingredientCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
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

                <div className="flex rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] p-1">
                  <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="h-8 px-3">
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="h-8 px-3">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span className="w-5 h-5">🍎</span>
            Ingredients ({filteredIngredients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <IngredientTable
            ingredients={filteredIngredients}
            categories={ingredientCategories}
            isLoading={isLoading}
            searchTerm={searchTerm}
            viewMode={viewMode}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            getCategoryName={getCategoryName}
          />
        </CardContent>
      </Card>

      <IngredientModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
        isLoading={isLoading}
        selectedIngredient={selectedIngredient}
        categories={ingredientCategories}
      />
    </div>
  );
}

export async function Page() {
  try {
    const [ingredients, categories] = await Promise.all([IngredientApiService.fetchIngredients(), IngredientApiService.fetchIngredientCategories()]);
    console.log("getServerSideProps response:", { ingredients, categories });
    return {
      props: {
        initialIngredients: Array.isArray(ingredients) ? ingredients : [],
        initialIngredientCategories: Array.isArray(categories) ? categories : [],
      },
    };
  } catch (error) {
    console.error("Error fetching data in getServerSideProps:", error);
    return {
      props: {
        initialIngredients: [],
        initialIngredientCategories: [], // Đổi tên cho nhất quán
      },
    };
  }
}
