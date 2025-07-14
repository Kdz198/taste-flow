import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import React from "react";

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

interface MenuTableProps {
  menus: Menu[];
  categories: Category[];
  ingredients: Ingredient[];
  isLoading: boolean;
  searchTerm: string;
  viewMode: "grid" | "list";
  handleEdit: (menu: Menu) => void;
  handleDelete: (id: number) => void;
  getCategoryNames: (categoryIds: number[]) => string;
  getIngredientNames: (ingredientsList: Ingredient[]) => string;
}

const MenuTable: React.FC<MenuTableProps> = ({
  menus,
  isLoading,
  searchTerm,
  viewMode,
  handleEdit,
  handleDelete,
  getCategoryNames,
  getIngredientNames,
}) => {
  if (isLoading && !menus.length) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-400">Loading menus...</div>
      </div>
    );
  }

  if (menus.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg mb-2">No menus found</p>
        <p className="text-sm text-gray-500">{searchTerm ? "Try adjusting your search criteria" : "Start by adding your first menu"}</p>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {menus.map((menu) => (
          <Card key={menu.id} className="bg-[#2A2A2A] border-[#3A3A3A] hover:border-orange-500/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-white text-lg">{menu.name}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="bg-[#2A2A2A] border-[#3A3A3A] hover:bg-[#3A3A3A]">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#2A2A2A] border-[#3A3A3A]">
                    <DropdownMenuItem onClick={() => handleEdit(menu)} className="text-white hover:bg-[#3A3A3A]">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Menu
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(menu.id)} className="text-red-400 hover:bg-red-600/20">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Price: ${menu.price.toFixed(2)}</p>
                <p className="text-sm text-gray-400">Categories: {getCategoryNames(menu.categories.map((cat) => cat.id))}</p>
                <p className="text-sm text-gray-400">Ingredients: {getIngredientNames(menu.ingredients)}</p>
                <Badge variant={menu.status ? "default" : "secondary"}>{menu.status ? "Active" : "Inactive"}</Badge>
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
      {menus.map((menu) => (
        <Card key={menu.id} className="bg-[#2A2A2A] border-[#3A3A3A] hover:border-orange-500/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-white text-lg">{menu.name}</h3>
                <p className="text-sm text-gray-400">Price: ${menu.price.toFixed(2)}</p>
                <p className="text-sm text-gray-400">Categories: {getCategoryNames(menu.categories.map((cat) => cat.id))}</p>
                <p className="text-sm text-gray-400">Ingredients: {getIngredientNames(menu.ingredients)}</p>
                <Badge variant={menu.status ? "default" : "secondary"}>{menu.status ? "Active" : "Inactive"}</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(menu)} className="bg-[#2A2A2A] border-[#3A3A3A] hover:bg-[#3A3A3A]">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(menu.id)} className="bg-red-600 hover:bg-red-700">
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

export default MenuTable;
