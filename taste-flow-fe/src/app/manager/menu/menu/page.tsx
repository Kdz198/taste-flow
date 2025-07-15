"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, ChefHat, Filter, Grid3X3, List, Plus, Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";

const MenuModal = dynamic(() => import("./modal"), { ssr: false });
const MenuTable = dynamic(() => import("./table"), { ssr: false });

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
interface Ingredient {
  id: number;
  name: string;
  quantity: number;
}

interface Category {
  id: number;
  name: string;
  status: boolean;
}

interface Menu {
  id: number;
  name: string;
  price: number;
  status: boolean;
  imgUrl: string;
  ingredients: Ingredient[];
  categories: Category[];
}

interface MenuFormData {
  id?: number;
  name: string;
  price: number;
  isAvailable: boolean;
  categories: number[];
  ingredients: Ingredient[];
  imageUrl: string;
}

// API Service Layer
class MenuApiService {
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
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    throw new Error("Max retries reached");
  }

  static async fetchMenus(): Promise<Menu[]> {
    const data = await this.makeRequest<{ success: boolean; message: string; data: Menu[] }>("/api/menus");
    return Array.isArray(data.data) ? data.data : [];
  }

  static async fetchCategories(): Promise<Category[]> {
    const data = await this.makeRequest<{ response: { data: Category[] } }>("/api/categories");
    return Array.isArray(data.response.data) ? data.response.data : [];
  }

  static async fetchIngredients(): Promise<Ingredient[]> {
    const data = await this.makeRequest<Ingredient[]>("/api/ingredients", {}, 1);
    console.log("Fetched ingredients:", data);
    return Array.isArray(data) ? data : [];
  }

  static async createMenu(menuData: {
    name: string;
    price: number;
    status: boolean;
    imgUrl: string;
    ingredients: Ingredient[];
    categories: number[];
  }): Promise<Menu> {
    return this.makeRequest<Menu>("/api/menus", {
      method: "POST",
      body: JSON.stringify(menuData),
    });
  }

  static async updateMenu(
    id: number,
    menuData: {
      id: number;
      name: string;
      price: number;
      isAvailable: boolean;
      imageUrl: string;
      ingredientsId: Ingredient[];
      categoriesId: number[];
    }
  ): Promise<Menu> {
    return this.makeRequest<Menu>(`/api/menus/${id}`, {
      method: "PUT",
      body: JSON.stringify(menuData),
    });
  }

  static async deleteMenu(id: number): Promise<{ success: boolean; message?: string }> {
    try {
      return this.makeRequest<{ success: boolean; message?: string }>(`/api/menus/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error deleting menu:", error.message);
      }
      throw error;
    }
  }
}

// Form validation
const validateMenuForm = (formData: MenuFormData): string[] => {
  const errors: string[] = [];

  if (!formData.name.trim()) {
    errors.push("Menu name is required");
  } else if (formData.name.trim().length < 2) {
    errors.push("Menu name must be at least 2 characters long");
  }

  if (formData.price <= 0) {
    errors.push("Price must be greater than 0");
  }

  if (formData.categories.length === 0) {
    errors.push("At least one category is required");
  }

  if (formData.ingredients.length === 0) {
    errors.push("At least one ingredient is required");
  }

  if (formData.ingredients.some((ing) => ing.id <= 0 || ing.quantity <= 0)) {
    errors.push("All ingredients must have valid ID and quantity greater than 0");
  }

  return errors;
};

// Main Component
export default function MenuPage({
  initialMenus = [],
  initialCategories = [],
  initialIngredients = [],
}: Readonly<{
  initialMenus?: Menu[];
  initialCategories?: Category[];
  initialIngredients?: Ingredient[];
}>) {
  const [menus, setMenus] = useState<Menu[]>(Array.isArray(initialMenus) ? initialMenus : []);
  const [categories, setCategories] = useState<Category[]>(Array.isArray(initialCategories) ? initialCategories : []);
  const [ingredients, setIngredients] = useState<Ingredient[]>(Array.isArray(initialIngredients) ? initialIngredients : []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [formData, setFormData] = useState<MenuFormData>({
    name: "",
    price: 0,
    isAvailable: true,
    categories: [],
    ingredients: [],
    imageUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const loadMenus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await MenuApiService.fetchMenus();
      // Map ingredient names from the ingredients state
      const updatedMenus = data.map((menu) => ({
        ...menu,
        ingredients: menu.ingredients.map((ing) => ({
          ...ing,
          name: ingredients.find((i) => i.id === ing.id)?.name || "Unknown",
        })),
      }));
      setMenus(updatedMenus);
    } catch (error) {
      const errorMessage = parseApiError(error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [ingredients]);

  const loadCategories = useCallback(async () => {
    try {
      const data = await MenuApiService.fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }, []);

  const loadIngredients = useCallback(async () => {
    try {
      const data = await MenuApiService.fetchIngredients();
      setIngredients(data);
    } catch (error) {
      console.error("Error loading ingredients:", error);
    }
  }, []);

  useEffect(() => {
    if (!initialMenus.length && menus.length === 0) {
      loadMenus();
    }
    if (!initialCategories.length && categories.length === 0) {
      loadCategories();
    }
    if (!initialIngredients.length && ingredients.length === 0) {
      loadIngredients();
    }
  }, [
    loadMenus,
    loadCategories,
    loadIngredients,
    initialMenus,
    initialCategories,
    initialIngredients,
    menus.length,
    categories.length,
    ingredients.length,
  ]);

  const filteredMenus = useMemo(() => {
    const filtered = Array.isArray(menus)
      ? menus.filter((menu) => {
          if (!menu || typeof menu.name !== "string") return false;
          const matchesSearch = menu.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesStatus = statusFilter === "all" || (statusFilter === "active" && menu.status) || (statusFilter === "inactive" && !menu.status);
          const matchesCategory = categoryFilter === "all" || menu.categories.some((cat) => cat.id.toString() === categoryFilter);
          return matchesSearch && matchesStatus && matchesCategory;
        })
      : [];

    filtered.sort((a, b) => {
      const idA = a.id || 0;
      const idB = b.id || 0;
      return sortOrder === "asc" ? idA - idB : idB - idA;
    });

    return filtered;
  }, [menus, searchTerm, statusFilter, categoryFilter, sortOrder]);

  const getStatistics = () => {
    const total = Array.isArray(menus) ? menus.length : 0;
    const active = Array.isArray(menus) ? menus.filter((menu) => menu.status).length : 0;
    const inactive = total - active;
    const avgPrice = total > 0 ? menus.reduce((sum, menu) => sum + (menu.price || 0), 0) / total : 0;
    return { total, active, inactive, avgPrice };
  };

  const handleSave = async () => {
    const errors = validateMenuForm(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setValidationErrors([]);

      if (selectedMenu?.id) {
        // PUT payload for edit
        const menuData = {
          id: selectedMenu.id,
          name: formData.name.trim(),
          price: formData.price,
          isAvailable: formData.isAvailable,
          imageUrl: formData.imageUrl.trim(),
          ingredientsId: formData.ingredients,
          categoriesId: formData.categories,
        };
        const updatedMenu = await MenuApiService.updateMenu(selectedMenu.id, menuData);
        setMenus(
          menus.map((menu) => (menu.id === selectedMenu.id ? { ...updatedMenu, imgUrl: updatedMenu.imgUrl, status: updatedMenu.status } : menu))
        );
      } else {
        // POST payload for add
        const menuData = {
          name: formData.name.trim(),
          price: formData.price,
          status: formData.isAvailable,
          imgUrl: formData.imageUrl.trim(),
          ingredients: formData.ingredients,
          categories: formData.categories,
        };
        const newMenu = await MenuApiService.createMenu(menuData);
        setMenus([...menus, { ...newMenu, imgUrl: newMenu.imgUrl, status: newMenu.status }]);
      }

      await loadMenus();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      setError(parseApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (menu: Menu) => {
    setSelectedMenu(menu);
    setFormData({
      id: menu.id,
      name: menu.name,
      price: menu.price,
      isAvailable: menu.status,
      categories: menu.categories.map((cat) => cat.id),
      ingredients: menu.ingredients,
      imageUrl: menu.imgUrl,
    });
    setValidationErrors([]);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa menu này không?")) return;

    try {
      setIsLoading(true);
      setError(null);
      const result = await MenuApiService.deleteMenu(id);

      if (result.success) {
        setMenus(menus.filter((menu) => menu.id !== id));
      } else {
        setError(result.message || "Không thể xóa menu. Menu này có thể đang được sử dụng trong các đơn hàng.");
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
      price: 0,
      isAvailable: true,
      categories: [],
      ingredients: [],
      imageUrl: "",
    });
    setValidationErrors([]);
    setSelectedMenu(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
    setError(null);
  };

  const getCategoryNames = (categoryIds: number[]): string => {
    if (!categoryIds || categoryIds.length === 0) {
      return "Uncategorized";
    }
    const categoryNames = categoryIds.map((id) => categories.find((cat) => cat.id === id)?.name).filter((name): name is string => name !== undefined);
    return categoryNames.length > 0 ? categoryNames.join(", ") : "Uncategorized";
  };

  const getIngredientNames = (ingredientsList: Ingredient[]): string => {
    if (!ingredientsList || ingredientsList.length === 0) {
      return "None";
    }
    const ingredientNames = ingredientsList
      .map((ing) => {
        const ingredient = ingredients.find((i) => i.id === ing.id);
        return ingredient ? `${ingredient.name} (${ing.quantity})` : `Unknown (${ing.quantity})`;
      })
      .filter((name) => name !== undefined);
    return ingredientNames.length > 0 ? ingredientNames.join(", ") : "None";
  };

  const stats = getStatistics();

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <p>Total Menus: {stats.total}</p>
          <p>Active: {stats.active}</p>
          <p>Inactive: {stats.inactive}</p>
          <p>Average Price: ${stats.avgPrice.toFixed(2)}</p>
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
          Add New Menu
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
                placeholder="Search menus by name..."
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

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-36 bg-[#2A2A2A] border-[#3A3A3A] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
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
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-orange-400" />
            Menu Items ({filteredMenus.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MenuTable
            menus={filteredMenus}
            categories={categories}
            ingredients={ingredients}
            isLoading={isLoading}
            searchTerm={searchTerm}
            viewMode={viewMode}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            getCategoryNames={getCategoryNames}
            getIngredientNames={getIngredientNames}
          />
        </CardContent>
      </Card>

      <MenuModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
        isLoading={isLoading}
        selectedMenu={selectedMenu}
        categories={categories}
        ingredients={ingredients}
      />
    </div>
  );
}

export async function Page() {
  try {
    const [menus, categories, ingredients] = await Promise.all([
      MenuApiService.fetchMenus(),
      MenuApiService.fetchCategories(),
      MenuApiService.fetchIngredients(),
    ]);
    // Map ingredient names for initialMenus
    const updatedMenus = menus.map((menu) => ({
      ...menu,
      ingredients: menu.ingredients.map((ing) => ({
        ...ing,
        name: ingredients.find((i) => i.id === ing.id)?.name || "Unknown",
      })),
    }));
    console.log("getServerSideProps response:", { menus: updatedMenus, categories, ingredients });

    return {
      props: {
        initialMenus: Array.isArray(updatedMenus) ? updatedMenus : [],
        initialCategories: Array.isArray(categories) ? categories : [],
        initialIngredients: Array.isArray(ingredients) ? ingredients : [],
      },
    };
  } catch (error) {
    console.error("Error fetching data in getServerSideProps:", error);
    return {
      props: {
        initialMenus: [],
        initialCategories: [],
        initialIngredients: [],
      },
    };
  }
}
