import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import React from "react";

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

interface IngredientDetailTableProps {
  ingredientDetails: IngredientDetail[];
  isLoading: boolean;
  searchTerm: string;
  viewMode: "grid" | "list";
  handleEdit: (detail: IngredientDetail) => void;
  handleDelete: (id: number) => void;
}

const IngredientDetailTable: React.FC<IngredientDetailTableProps> = ({
  ingredientDetails,
  isLoading,
  searchTerm,
  viewMode,
  handleEdit,
  handleDelete,
}) => {
  if (isLoading && !ingredientDetails.length) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-400">Loading ingredient details...</div>
      </div>
    );
  }

  if (ingredientDetails.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg mb-2">No ingredient details found</p>
        <p className="text-sm text-gray-500">{searchTerm ? "Try adjusting your search criteria" : "Start by adding your first ingredient detail"}</p>
      </div>
    );
  }

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (viewMode === "grid") {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ingredientDetails.map((detail) => (
          <Card key={detail.id} className="bg-[#2A2A2A] border-[#3A3A3A] hover:border-orange-500/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-white text-lg">{detail.ingredient.name}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="bg-[#2A2A2A] border-[#3A3A3A] hover:bg-[#3A3A3A]">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#2A2A2A] border-[#3A3A3A]">
                    <DropdownMenuItem onClick={() => handleEdit(detail)} className="text-white hover:bg-[#3A3A3A]">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(detail.id)} className="text-red-400 hover:bg-red-600/20">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Category: {detail.ingredient.category.name}</p>
                <p className="text-sm text-gray-400">Entry Date: {formatDate(detail.entryDate)}</p>
                <p className="text-sm text-gray-400">Expire Date: {formatDate(detail.expireDate)}</p>
                <p className="text-sm text-gray-400">Quantity: {detail.quantity}</p>
                <p className="text-sm text-gray-400">Available: {detail.availableQuantity}</p>
                <p className="text-sm text-gray-400">Last Reserved At: {formatDate(detail.lastReservedAt)}</p>
                <p className="text-sm text-gray-400">Reserved: {detail.reserved}</p>
                <Badge variant={detail.active ? "default" : "secondary"}>{detail.active ? "Active" : "Inactive"}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // List mode
  return (
    <div className="space-y-4">
      {ingredientDetails.map((detail) => (
        <Card key={detail.id} className="bg-[#2A2A2A] border-[#3A3A3A] hover:border-orange-500/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex-col space-y-2">
                <h3 className="font-semibold text-white text-lg">{detail.ingredient.name}</h3>
                <p className="text-sm text-gray-400">Category: {detail.ingredient.category.name}</p>
                <p className="text-sm text-gray-400">Entry Date: {formatDate(detail.entryDate)}</p>
                <p className="text-sm text-gray-400">Expire Date: {formatDate(detail.expireDate)}</p>
                <p className="text-sm text-gray-400">Quantity: {detail.quantity}</p>
                <p className="text-sm text-gray-400">Available: {detail.availableQuantity}</p>
                <p className="text-sm text-gray-400">Last Reserved At: {formatDate(detail.lastReservedAt)}</p>
                <p className="text-sm text-gray-400">Reserved: {detail.reserved}</p>
                <Badge variant={detail.active ? "default" : "secondary"}>{detail.active ? "Active" : "Inactive"}</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(detail)} className="bg-[#2A2A2A] border-[#3A3A3A] hover:bg-[#3A3A3A]">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(detail.id)} className="bg-red-600 hover:bg-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default IngredientDetailTable;
