"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Filter, Grid3X3, List, Plus, Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const IngredientDetailModal = dynamic(() => import("./modal"), { ssr: false });
const IngredientDetailTable = dynamic(() => import("./table"), { ssr: false });

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
  category: {
    id: number;
    name: string;
    description: string;
  };
  unit: string;
  active: boolean;
}

interface IngredientDetail {
  id: number;
  ingredient: Ingredient;
  entryDate: string;
  expireDate: string;
  quantity: number;
  active: boolean;
  reserved: number;
  lastReservedAt: string;
  availableQuantity: number;
}

interface IngredientDetailFormData {
  id?: number;
  ingredient: Ingredient;
  entryDate: string;
  expireDate: string;
  quantity: number;
  active: boolean;
  reserved: number;
  lastReservedAt: string;
  availableQuantity: number;
}

// API Service Layer
class IngredientDetailApiService {
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

  static async fetchIngredientDetails(ingredientId: string): Promise<IngredientDetail[]> {
    const data = await this.makeRequest<IngredientDetail[]>(`/api/ingredient-details/find-by-ingredient/${ingredientId}`);
    return Array.isArray(data) ? data : [];
  }

  static async fetchIngredients(): Promise<Ingredient[]> {
    const data = await this.makeRequest<Ingredient[]>("/api/ingredients", {}, 1);
    return Array.isArray(data) ? data : [];
  }

  static async createIngredientDetail(detailData: IngredientDetailFormData): Promise<IngredientDetail> {
    return this.makeRequest<IngredientDetail>("/api/ingredient-details", {
      method: "POST",
      body: JSON.stringify(detailData),
    });
  }

  static async updateIngredientDetail(id: number, detailData: IngredientDetailFormData): Promise<IngredientDetail> {
    return this.makeRequest<IngredientDetail>(`/api/ingredient-details`, {
      method: "PUT",
      body: JSON.stringify(detailData),
    });
  }

  static async deleteIngredientDetail(id: number): Promise<{ success: boolean; message?: string }> {
    try {
      return this.makeRequest<{ success: boolean; message?: string }>(`/api/ingredient-details/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error deleting ingredient detail:", error.message);
      }
      throw error;
    }
  }
}

// Form validation
const validateIngredientDetailForm = (formData: IngredientDetailFormData): string[] => {
  const errors: string[] = [];

  if (!formData.ingredient.id) {
    errors.push("Ingredient is required");
  }

  if (!formData.entryDate) {
    errors.push("Entry date is required");
  }

  if (!formData.expireDate) {
    errors.push("Expire date is required");
  } else if (new Date(formData.expireDate) <= new Date(formData.entryDate)) {
    errors.push("Expire date must be after entry date");
  }

  if (formData.quantity <= 0) {
    errors.push("Quantity must be greater than 0");
  }

  return errors;
};

// Main Component
export default function IngredientDetailPage({
  initialIngredientDetails = [],
  initialIngredients = [],
}: Readonly<{
  initialIngredientDetails?: IngredientDetail[];
  initialIngredients?: Ingredient[];
}>) {
  const { id } = useParams();
  const [ingredientDetails, setIngredientDetails] = useState<IngredientDetail[]>(
    Array.isArray(initialIngredientDetails) ? initialIngredientDetails : []
  );
  const [ingredients, setIngredients] = useState<Ingredient[]>(Array.isArray(initialIngredients) ? initialIngredients : []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredientDetail, setSelectedIngredientDetail] = useState<IngredientDetail | null>(null);
  const [formData, setFormData] = useState<IngredientDetailFormData>({
    ingredient: { id: Number(id), name: "", category: { id: 0, name: "", description: "" }, unit: "GRAM", active: true },
    entryDate: "",
    expireDate: "",
    quantity: 0,
    active: true,
    reserved: 0,
    lastReservedAt: "",
    availableQuantity: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const loadIngredientDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await IngredientDetailApiService.fetchIngredientDetails(id as string);
      setIngredientDetails(data);
    } catch (error) {
      const errorMessage = parseApiError(error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const loadIngredients = useCallback(async () => {
    try {
      const data = await IngredientDetailApiService.fetchIngredients();
      setIngredients(data);
    } catch (error) {
      console.error("Error loading ingredients:", error);
    }
  }, []);

  useEffect(() => {
    if (!initialIngredientDetails.length && ingredientDetails.length === 0) {
      loadIngredientDetails();
    }
    if (!initialIngredients.length && ingredients.length === 0) {
      loadIngredients();
    }
  }, [loadIngredientDetails, loadIngredients, initialIngredientDetails, initialIngredients, ingredientDetails.length, ingredients.length]);

  const filteredIngredientDetails = useMemo(() => {
    const filtered = Array.isArray(ingredientDetails)
      ? ingredientDetails.filter((detail) => {
          if (!detail) return false;
          const matchesSearch = detail.ingredient.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesStatus =
            statusFilter === "all" || (statusFilter === "active" && detail.active) || (statusFilter === "inactive" && !detail.active);
          return matchesSearch && matchesStatus;
        })
      : [];

    filtered.sort((a, b) => {
      const idA = a.id || 0;
      const idB = b.id || 0;
      return sortOrder === "asc" ? idA - idB : idB - idA;
    });

    return filtered;
  }, [ingredientDetails, searchTerm, statusFilter, sortOrder]);

  const getStatistics = () => {
    const total = Array.isArray(ingredientDetails) ? ingredientDetails.length : 0;
    const active = Array.isArray(ingredientDetails) ? ingredientDetails.filter((detail) => detail.active).length : 0;
    const inactive = total - active;
    const totalQuantity = total > 0 ? ingredientDetails.reduce((sum, detail) => sum + (detail.availableQuantity || 0), 0) : 0;
    return { total, active, inactive, totalQuantity };
  };

  const handleSave = async () => {
    const errors = validateIngredientDetailForm(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setValidationErrors([]);

      if (selectedIngredientDetail?.id) {
        const updatedDetail = await IngredientDetailApiService.updateIngredientDetail(selectedIngredientDetail.id, formData);
        setIngredientDetails(ingredientDetails.map((detail) => (detail.id === selectedIngredientDetail.id ? updatedDetail : detail)));
      } else {
        const newDetail = await IngredientDetailApiService.createIngredientDetail(formData);
        setIngredientDetails([...ingredientDetails, newDetail]);
      }

      await loadIngredientDetails();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      setError(parseApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (detail: IngredientDetail) => {
    setSelectedIngredientDetail(detail);
    setFormData({
      id: detail.id,
      ingredient: detail.ingredient,
      entryDate: detail.entryDate,
      expireDate: detail.expireDate,
      quantity: detail.quantity,
      active: detail.active,
      reserved: detail.reserved,
      lastReservedAt: detail.lastReservedAt,
      availableQuantity: detail.availableQuantity,
    });
    setValidationErrors([]);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa chi tiết nguyên liệu này không?")) return;

    try {
      setIsLoading(true);
      setError(null);
      const result = await IngredientDetailApiService.deleteIngredientDetail(id);

      if (result.success) {
        setIngredientDetails(ingredientDetails.filter((detail) => detail.id !== id));
      } else {
        setError(result.message || "Không thể xóa chi tiết nguyên liệu.");
      }
    } catch (error) {
      setError(parseApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      ingredient: { id: Number(id), name: "", category: { id: 0, name: "", description: "" }, unit: "GRAM", active: true },
      entryDate: "",
      expireDate: "",
      quantity: 0,
      active: true,
      reserved: 0,
      lastReservedAt: "",
      availableQuantity: 0,
    });
    setValidationErrors([]);
    setSelectedIngredientDetail(null);
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
          <p>Total Details: {stats.total}</p>
          <p>Active: {stats.active}</p>
          <p>Inactive: {stats.inactive}</p>
          <p>Total Quantity: {stats.totalQuantity}</p>
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
          Add New Detail
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
                placeholder="Search ingredient details..."
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
          <CardTitle className="text-white flex items-center gap-2">Ingredient Details ({filteredIngredientDetails.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <IngredientDetailTable
            ingredientDetails={filteredIngredientDetails}
            isLoading={isLoading}
            searchTerm={searchTerm}
            viewMode={viewMode}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <IngredientDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
        isLoading={isLoading}
        selectedIngredientDetail={selectedIngredientDetail}
        ingredients={ingredients}
      />
    </div>
  );
}

export async function Page({ params }: { params: { id: string } }) {
  try {
    const ingredientId = params.id;

    if (!ingredientId || isNaN(Number(ingredientId))) {
      return {
        props: {
          initialIngredientDetails: [],
          initialIngredients: [],
        },
      };
    }

    const [ingredientDetails, ingredients] = await Promise.all([
      IngredientDetailApiService.fetchIngredientDetails(ingredientId),
      IngredientDetailApiService.fetchIngredients(),
    ]);

    return {
      props: {
        initialIngredientDetails: Array.isArray(ingredientDetails) ? ingredientDetails : [],
        initialIngredients: Array.isArray(ingredients) ? ingredients : [],
      },
    };
  } catch (error) {
    console.error("Error fetching data in getServerSideProps:", error);
    return {
      props: {
        initialIngredientDetails: [],
        initialIngredients: [],
      },
    };
  }
}
