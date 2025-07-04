"use client";
import { categoryMock, dishMock } from "@/app/utils/mockApi";
import { Dish, UserStatus } from "@/app/utils/type";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, ChefHat, Filter, Grid3X3, List, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import DishModal from "./modal";
import DishTable from "./table";

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" || true;

// Token management
const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken") || null;
};

// Types
interface DishFormData {
  name: string;
  price: number;
  status: UserStatus;
  category: string[];
  receipt: string[];
  image: string;
}

interface Category {
  id: string;
  name: string;
  status?: boolean;
}

// API Service Layer
class DishApiService {
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

  static async fetchDishes(): Promise<Dish[]> {
    if (USE_MOCK_DATA) {
      return Promise.resolve(dishMock);
    }
    return this.makeRequest<Dish[]>("/api/dishes");
  }

  static async fetchCategories(): Promise<Category[]> {
    if (USE_MOCK_DATA) {
      return Promise.resolve(categoryMock);
    }
    return this.makeRequest<Category[]>("/api/categories");
  }

  static async createDish(dishData: Omit<Dish, "id" | "createdAt" | "updatedAt">): Promise<Dish> {
    if (USE_MOCK_DATA) {
      return Promise.resolve({
        id: Date.now().toString(),
        ...dishData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    return this.makeRequest<Dish>("/api/dishes", {
      method: "POST",
      body: JSON.stringify(dishData),
    });
  }

  static async updateDish(id: string, dishData: Omit<Dish, "id" | "createdAt" | "updatedAt">): Promise<Dish> {
    if (USE_MOCK_DATA) {
      return Promise.resolve({
        id,
        ...dishData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    return this.makeRequest<Dish>(`/api/dishes/${id}`, {
      method: "PUT",
      body: JSON.stringify(dishData),
    });
  }

  static async deleteDish(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ success: true });
    }
    return this.makeRequest<{ success: boolean }>(`/api/dishes/${id}`, {
      method: "DELETE",
    });
  }
}

// Form validation
const validateDishForm = (formData: DishFormData): string[] => {
  const errors: string[] = [];

  if (!formData.name.trim()) {
    errors.push("Dish name is required");
  } else if (formData.name.trim().length < 2) {
    errors.push("Dish name must be at least 2 characters long");
  }

  if (formData.price <= 0) {
    errors.push("Price must be greater than 0");
  }

  if (formData.image && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(formData.image)) {
    errors.push("Please enter a valid image URL");
  }

  return errors;
};

export default function DishPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [formData, setFormData] = useState<DishFormData>({
    name: "",
    price: 0,
    status: UserStatus.ACTIVE,
    category: [],
    receipt: [],
    image: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    loadDishes();
    loadCategories();
  }, []);

  useEffect(() => {
    filterAndSortDishes();
  }, [dishes, searchTerm, statusFilter, categoryFilter, sortOrder]);

  const loadDishes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await DishApiService.fetchDishes();
      setDishes(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load dishes";
      setError(errorMessage);
      console.error("Error loading dishes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await DishApiService.fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const filterAndSortDishes = () => {
    const filtered = dishes.filter((dish) => {
      const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || dish.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || (dish.category && dish.category.some((catId) => catId === categoryFilter));

      return matchesSearch && matchesStatus && matchesCategory;
    });

    filtered.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredDishes(filtered);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      status: UserStatus.ACTIVE,
      category: [],
      receipt: [],
      image: "",
    });
    setValidationErrors([]);
    setSelectedDish(null);
  };

  const handleSave = async () => {
    const errors = validateDishForm(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setValidationErrors([]);

      const dishData = {
        name: formData.name.trim(),
        price: formData.price,
        status: formData.status,
        category: formData.category,
        receipt: formData.receipt.filter((item) => item.trim() !== ""),
        image: formData.image.trim(),
      };

      if (selectedDish?.id) {
        const updatedDish = await DishApiService.updateDish(selectedDish.id, dishData);
        setDishes(dishes.map((dish) => (dish.id === selectedDish.id ? updatedDish : dish)));
      } else {
        const newDish = await DishApiService.createDish(dishData);
        setDishes([...dishes, newDish]);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save dish";
      setError(errorMessage);
      console.error("Error saving dish:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (dish: Dish) => {
    setSelectedDish(dish);
    setFormData({
      name: dish.name,
      price: dish.price || 0,
      status: dish.status,
      category: dish.category || [],
      receipt: dish.receipt || [],
      image: dish.image || "",
    });
    setValidationErrors([]);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this dish?")) return;

    try {
      setIsLoading(true);
      setError(null);
      await DishApiService.deleteDish(id);
      setDishes(dishes.filter((dish) => dish.id !== id));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete dish";
      setError(errorMessage);
      console.error("Error deleting dish:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
    setError(null);
  };

  const getCategoryNames = (categoryIds: string[]): string => {
    if (!categoryIds || categoryIds.length === 0) return "Uncategorized";
    return categoryIds.map((id) => categories.find((cat) => cat.id === id)?.name || id).join(", ");
  };

  const getStatistics = () => {
    const total = dishes.length;
    const active = dishes.filter((dish) => dish.status === UserStatus.ACTIVE).length;
    const inactive = total - active;
    const avgPrice = dishes.length > 0 ? dishes.reduce((sum, dish) => sum + (dish.price || 0), 0) / dishes.length : 0;

    return { total, active, inactive, avgPrice };
  };

  const stats = getStatistics();

  // Update the statistics cards with the actual values
  useEffect(() => {
    const totalElement = document.getElementById("dish-total-count");
    const activeElement = document.getElementById("dish-active-count");
    const inactiveElement = document.getElementById("dish-inactive-count");
    const avgPriceElement = document.getElementById("dish-avg-price");

    if (totalElement) totalElement.textContent = stats.total.toString();
    if (activeElement) activeElement.textContent = stats.active.toString();
    if (inactiveElement) inactiveElement.textContent = stats.inactive.toString();
    if (avgPriceElement) avgPriceElement.textContent = `$${stats.avgPrice.toFixed(2)}`;
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
          Add New Dish
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
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search dishes by name..."
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

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-36 bg-[#2A2A2A] border-[#3A3A3A] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
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

      {/* Dishes Table (tách ra component) */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-orange-400" />
            Menu Items ({filteredDishes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DishTable
            dishes={filteredDishes}
            categories={categories}
            isLoading={isLoading}
            searchTerm={searchTerm}
            viewMode={viewMode}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Modal (tách ra component) */}
      <DishModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
        isLoading={isLoading}
        selectedDish={selectedDish}
        categories={categories}
      />
    </div>
  );
}
