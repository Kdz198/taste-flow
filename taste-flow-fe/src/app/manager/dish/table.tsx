
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dish, UserStatus } from "@/utils/type";
import { BookOpen, ChefHat, Clock, Edit2, ImageIcon, MapPin, MoreHorizontal, Trash2 } from "lucide-react";
import React from "react";

interface Category {
  id: string;
  name: string;
  status?: boolean;
}

interface DishTableProps {
  dishes: Dish[];
  categories: Category[];
  isLoading: boolean;
  searchTerm: string;
  viewMode: "grid" | "list";
  handleEdit: (dish: Dish) => void;
  handleDelete: (id: string) => void;
}

const getCategoryNames = (categoryIds: string[], categories: Category[]): string => {
  if (!categoryIds || categoryIds.length === 0) return "Uncategorized";
  return categoryIds.map((id) => categories.find((cat) => cat.id === id)?.name || id).join(", ");
};

const DishTable: React.FC<DishTableProps> = ({ dishes, categories, isLoading, searchTerm, viewMode, handleEdit, handleDelete }) => {
  if (isLoading && !dishes.length) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-400">Loading delicious dishes...</div>
      </div>
    );
  }
  if (dishes.length === 0) {
    return (
      <div className="text-center py-12">
        <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400 text-lg mb-2">No dishes found</p>
        <p className="text-sm text-gray-500">{searchTerm ? "Try adjusting your search criteria" : "Start by adding your first dish to the menu"}</p>
      </div>
    );
  }
  if (viewMode === "grid") {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dishes.map((dish) => (
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
                    {getCategoryNames(dish.category || [], categories)}
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
    );
  }
  // List mode
  return (
    <div className="space-y-4">
      {dishes.map((dish) => (
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
                  <span>Categories: {getCategoryNames(dish.category || [], categories)}</span>
                  {dish.receipt && dish.receipt.length > 0 && <span>Ingredients: {dish.receipt.length} items</span>}
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={dish.status === UserStatus.ACTIVE ? "default" : "secondary"}>{dish.status}</Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(dish)} className="bg-[#3A3A3A] border-[#4A4A4A] hover:bg-[#4A4A4A]">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(dish.id)}>
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
  );
};

export default DishTable;
