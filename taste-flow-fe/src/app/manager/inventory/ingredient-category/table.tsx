import { Button } from "@/components/ui/button";
import { IngredientCategory } from "@/interfaces/ingredient.interface";
import { Edit2, Eye, Trash2 } from "lucide-react";
import React from "react";

interface IngredientCategoriesTableProps {
  categories: IngredientCategory[];
  isLoading: boolean;
  searchTerm: string;
  handleEdit: (category: IngredientCategory) => void;
  handleDelete: (id: number) => void;
}

const IngredientCategoriesTable: React.FC<IngredientCategoriesTableProps> = ({ categories, isLoading, searchTerm, handleEdit, handleDelete }) => {
  if (isLoading && !categories.length) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-400">Loading categories...</div>
      </div>
    );
  }
  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">No ingredient categories found</p>
        {searchTerm && <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filter criteria</p>}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#2A2A2A]">
            <th className="text-left py-3 px-4 text-gray-400 font-medium">ID</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Description</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-b border-[#2A2A2A] hover:bg-[#2A2A2A]/50 transition-colors">
              <td className="py-4 px-4 text-gray-300 font-mono text-sm">{category.id}</td>
              <td className="py-4 px-4">
                <div className="font-medium text-white">{category.name}</div>
              </td>
              <td className="py-4 px-4 text-gray-300">{category.description}</td>
              <td className="py-4 px-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                    className="bg-[#2A2A2A] border-[#3A3A3A] hover:bg-[#3A3A3A]"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IngredientCategoriesTable;
