"use client";
import { categoryMock, dishMock } from "@/app/utils/mockApi";
import { Dish, UserStatus } from "@/app/utils/type";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowUpDown,
  BookOpen,
  ChefHat,
  Clock,
  DollarSign,
  Edit2,
  Filter,
  Grid3X3,
  ImageIcon,
  List,
  MapPin,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Dish Management</h1>
          <p className="text-gray-400 mt-1">Create and manage your delicious menu items</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Dish
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#1A1A1A] border-[#2A2A2A] hover:border-orange-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Dishes</CardTitle>
            <ChefHat className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <p className="text-xs text-gray-400 mt-1">Menu items available</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#2A2A2A] hover:border-green-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Dishes</CardTitle>
            <Star className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stats.active}</div>
            <p className="text-xs text-gray-400 mt-1">Available for order</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#2A2A2A] hover:border-red-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Inactive Dishes</CardTitle>
            <Package className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{stats.inactive}</div>
            <p className="text-xs text-gray-400 mt-1">Currently unavailable</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#2A2A2A] hover:border-blue-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg. Price</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">${stats.avgPrice.toFixed(2)}</div>
            <p className="text-xs text-gray-400 mt-1">Average dish price</p>
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

      {/* Dishes Display */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-orange-400" />
            Menu Items ({filteredDishes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && !dishes.length ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-400">Loading delicious dishes...</div>
            </div>
          ) : filteredDishes.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No dishes found</p>
              <p className="text-sm text-gray-500">
                {searchTerm ? "Try adjusting your search criteria" : "Start by adding your first dish to the menu"}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDishes.map((dish) => (
                <Card key={dish.id} className="bg-[#2A2A2A] border-[#3A3A3A] hover:border-orange-500/50 transition-all duration-300 group">
                  <CardContent className="p-0">
                    <div className="relative">
                      {dish.image ? (
                        <img src={dish.image} alt={dish.name} className="w-full h-48 object-cover rounded-t-lg" />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-gray-600 to-gray-800 rounded-t-lg flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}

                      <div className="absolute top-4 right-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="h-8 w-8 bg-black/50 hover:bg-black/70 border-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#2A2A2A] border-[#3A3A3A]">
                            <DropdownMenuItem onClick={() => handleEdit(dish)} className="text-white hover:bg-[#3A3A3A]">
                              <Edit2 className="w-4 h-4 mr-2" />
                              Edit Dish
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(dish.id)} className="text-red-400 hover:bg-red-600/20">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="absolute top-4 left-4">
                        <Badge variant={dish.status === UserStatus.ACTIVE ? "default" : "secondary"}>{dish.status}</Badge>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-white text-lg group-hover:text-orange-400 transition-colors">{dish.name}</h3>
                        <div className="text-2xl font-bold text-orange-400">${dish.price ? dish.price.toFixed(2) : "0.00"}</div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin className="w-4 h-4" />
                          {getCategoryNames(dish.category || [])}
                        </div>

                        {dish.receipt && dish.receipt.length > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <BookOpen className="w-4 h-4" />
                            {dish.receipt.slice(0, 2).join(", ")}
                            {dish.receipt.length > 2 && ` +${dish.receipt.length - 2} more`}
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          ID: {dish.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDishes.map((dish) => (
                <Card key={dish.id} className="bg-[#2A2A2A] border-[#3A3A3A] hover:border-orange-500/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        {dish.image ? (
                          <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                            <ChefHat className="w-8 h-8" />
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-white text-lg">{dish.name}</h3>
                          <div className="text-xl font-bold text-orange-400">${dish.price ? dish.price.toFixed(2) : "0.00"}</div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                          <span>ID: {dish.id}</span>
                          <span>Categories: {getCategoryNames(dish.category || [])}</span>
                          {dish.receipt && dish.receipt.length > 0 && <span>Ingredients: {dish.receipt.length} items</span>}
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant={dish.status === UserStatus.ACTIVE ? "default" : "secondary"}>{dish.status}</Badge>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(dish)}
                              disabled={isLoading}
                              className="bg-[#3A3A3A] border-[#4A4A4A] hover:bg-[#4A4A4A]"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(dish.id)} disabled={isLoading}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedDish?.id ? "Edit Dish" : "Create New Dish"} className="max-w-4xl">
        <div className="space-y-6">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Card className="bg-red-600/20 border-red-600">
              <CardContent className="pt-4">
                <ul className="text-red-400 text-sm space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-red-400 rounded-full" />
                      {error}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white flex items-center gap-2">
                  <ChefHat className="w-4 h-4" />
                  Dish Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter delicious dish name"
                  className="mt-1 bg-[#2A2A2A] border-[#3A3A3A] text-white"
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price" className="text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Price *
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="mt-1 bg-[#2A2A2A] border-[#3A3A3A] text-white"
                  disabled={isLoading}
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>

              <div>
                <Label className="text-white flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as UserStatus })}
                  disabled={isLoading}
                >
                  <SelectTrigger className="mt-1 bg-[#2A2A2A] border-[#3A3A3A] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                    {Object.values(UserStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="image" className="text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Image URL
                </Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/dish-image.jpg"
                  className="mt-1 bg-[#2A2A2A] border-[#3A3A3A] text-white"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Right Column - Categories & Ingredients */}
            <div className="space-y-4">
              <div>
                <Label className="text-white flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Categories
                </Label>
                <select
                  multiple
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: Array.from(e.target.selectedOptions, (option) => option.value),
                    })
                  }
                  className="mt-1 w-full p-3 bg-[#2A2A2A] border border-[#3A3A3A] rounded-md text-white min-h-[120px] focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  disabled={isLoading}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="py-2 px-3 hover:bg-[#3A3A3A]">
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple categories</p>
              </div>

              <div>
                <Label htmlFor="receipt" className="text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Ingredients
                </Label>
                <Input
                  id="receipt"
                  type="text"
                  value={formData.receipt.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      receipt: e.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter((item) => item !== ""),
                    })
                  }
                  placeholder="Tomato, Cheese, Basil, Olive Oil"
                  className="mt-1 bg-[#2A2A2A] border-[#3A3A3A] text-white"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-400 mt-1">Separate ingredients with commas</p>
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div>
                  <Label className="text-white">Preview</Label>
                  <div className="mt-1 border border-[#3A3A3A] rounded-lg p-2 bg-[#2A2A2A]">
                    <img
                      src={formData.image}
                      alt="Dish preview"
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-[#2A2A2A]">
            <Button variant="outline" onClick={handleCloseModal} disabled={isLoading} className="bg-[#2A2A2A] border-[#3A3A3A] hover:bg-[#3A3A3A]">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || !formData.name.trim() || formData.price <= 0}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              {isLoading ? "Saving..." : selectedDish?.id ? "Update Dish" : "Create Dish"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
