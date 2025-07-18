import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ingredient, IngredientCategory } from "@/interfaces/ingredient.interface";
import { Edit2, EyeIcon, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";

interface IngredientTableProps {
  ingredients: Ingredient[];
  categories: IngredientCategory[];
  isLoading: boolean;
  searchTerm: string;
  viewMode: "grid" | "list";
  handleEdit: (ingredient: Ingredient) => void;
  handleDelete: (id: number) => void;
  getIngredientCategoryName: (categoryId: number) => string;
}

const IngredientTable: React.FC<IngredientTableProps> = ({
  ingredients,
  isLoading,
  searchTerm,
  viewMode,
  handleEdit,
  handleDelete,
  getIngredientCategoryName,
}) => {
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="bg-yellow-500/20 text-yellow-400">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  if (isLoading && !ingredients.length) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-400">Loading ingredients...</div>
      </div>
    );
  }

  if (ingredients.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg mb-2">No ingredients found</p>
        <p className="text-sm text-gray-500">{searchTerm ? "Try adjusting your search criteria" : "Start by adding your first ingredient"}</p>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ingredients
          .map((ingredient) => (
            <Card key={ingredient.id} className="bg-[#2A2A2A] border-[#3A3A3A] hover:border-orange-500/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-white text-lg">{highlightText(ingredient.name, searchTerm)}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-[#2A2A2A] border-[#3A3A3A] hover:bg-[#3A3A3A]">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#2A2A2A] border-[#3A3A3A]">
                      <Link
                        href={`ingredient/${ingredient.id}`}
                        className="flex items-center hover:underline"
                        aria-label={`View details for ${ingredient.name}`}
                      >
                        <DropdownMenuItem className="text-white hover:bg-[#3A3A3A]">
                          <EyeIcon className="w-4 h-4 mr-2" />
                          Detail
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onClick={() => handleEdit(ingredient)} className="text-white hover:bg-[#3A3A3A]">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Ingredient
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(ingredient.id)} className="text-red-400 hover:bg-red-600/20">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">IngredientCategory: {getIngredientCategoryName(ingredient.category.id)}</p>
                  <p className="text-sm text-gray-400">Unit: {ingredient.unit}</p>
                  <Badge variant={ingredient.active ? "default" : "secondary"}>{ingredient.active ? "Active" : "Inactive"}</Badge>
                </div>
              </CardContent>
            </Card>
          ))
          .reverse()}
      </div>
    );
  }

  // List mode
  return (
    <div className="space-y-4">
      {ingredients
        .map((ingredient) => (
          <Card key={ingredient.id} className="bg-[#2A2A2A] border-[#3A3A3A] hover:border-orange-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-white text-lg">{highlightText(ingredient.name, searchTerm)}</h3>
                  <p className="text-sm text-gray-400">IngredientCategory: {getIngredientCategoryName(ingredient.category.id)}</p>
                  <p className="text-sm text-gray-400">Unit: {ingredient.unit}</p>
                  <Badge variant={ingredient.active ? "default" : "secondary"}>{ingredient.active ? "Active" : "Inactive"}</Badge>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`ingredient/${ingredient.id}`}
                    aria-label={`View details for ${ingredient.name}`}
                    className="bg-[#2A2A2A] border-[#3A3A3A] hover:bg-[#3A3A3A]"
                  >
                    <Button variant="outline" size="sm" className="bg-[#2A2A2A] border-[#3A3A3A] hover:bg-[#3A3A3A]">
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(ingredient)}
                    className="bg-[#2A2A2A] border-[#3A3A3A] hover:bg-[#3A3A3A]"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(ingredient.id)} className="bg-red-600 hover:bg-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
        .reverse()}
    </div>
  );
};

export default IngredientTable;
