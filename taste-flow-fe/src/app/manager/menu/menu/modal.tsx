import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

interface Category {
  id: number;
  name: string;
  status: boolean;
}

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
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

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: MenuFormData;
  setFormData: (data: MenuFormData) => void;
  validationErrors: string[];
  isLoading: boolean;
  selectedMenu: { id?: number } | null;
  categories: Category[];
  ingredients: Ingredient[];
}

const MenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  onClose,
  onSave,
  formData,
  setFormData,
  validationErrors,
  isLoading,
  selectedMenu,
  categories,
  ingredients,
}) => {
  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number) => {
    const newIngredients = [...formData.ingredients];
    if (field === "id") {
      const selectedIngredient = ingredients.find((ing) => ing.id === parseInt(value as string));
      newIngredients[index] = {
        ...newIngredients[index],
        id: parseInt(value as string) || 0,
        name: selectedIngredient ? selectedIngredient.name : "",
      };
    } else {
      newIngredients[index] = { ...newIngredients[index], quantity: parseFloat(value as string) || 0 };
    }
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { id: 0, name: "", quantity: 1 }],
    });
  };

  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={selectedMenu?.id ? "Edit Menu" : "Add New Menu"} className="max-w-lg">
      <div className="space-y-6">
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Card className="bg-red-600/20 border-red-600">
            <CardContent className="pt-4">
              <ul className="text-red-400 text-sm space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">
              Menu Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter menu name"
              className="mt-1 bg-[#2A2A2A] border-[#3A3A3A] text-white"
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <Label htmlFor="price" className="text-white">
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
            <Label htmlFor="imageUrl" className="text-white">
              Image URL
            </Label>
            <Input
              id="imageUrl"
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="Enter image URL"
              className="mt-1 bg-[#2A2A2A] border-[#3A3A3A] text-white"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="categories" className="text-white">
              Categories *
            </Label>
            <Select
              value={formData.categories.length > 0 ? formData.categories[0].toString() : ""}
              onValueChange={(value) => {
                const categoryId = parseInt(value);
                if (!isNaN(categoryId)) {
                  setFormData({
                    ...formData,
                    categories: [categoryId],
                  });
                }
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="mt-1 bg-[#2A2A2A] border-[#3A3A3A] text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-400 mt-1">Currently, only one category can be selected</p>
          </div>
          <div>
            <Label className="text-white">Ingredients *</Label>
            <div className="space-y-2">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Select value={ingredient.id.toString()} onValueChange={(value) => handleIngredientChange(index, "id", value)} disabled={isLoading}>
                    <SelectTrigger className="bg-[#2A2A2A] border-[#3A3A3A] text-white">
                      <SelectValue placeholder="Select ingredient" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                      {ingredients.map((ing) => (
                        <SelectItem key={ing.id} value={ing.id.toString()}>
                          {ing.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                    placeholder="Quantity"
                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                    disabled={isLoading}
                    min="1"
                    step="1"
                    required
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeIngredient(index)}
                    disabled={isLoading || formData.ingredients.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addIngredient}
                disabled={isLoading}
                className="mt-2 bg-[#2A2A2A] border-[#3A3A3A] hover:bg-[#3A3A3A]"
              >
                Add Ingredient
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Select ingredient and specify quantity. At least one ingredient is required.</p>
          </div>
          <div>
            <Label className="text-white">Status</Label>
            <Select
              value={formData.isAvailable ? "active" : "inactive"}
              onValueChange={(value) => setFormData({ ...formData, isAvailable: value === "active" })}
              disabled={isLoading}
            >
              <SelectTrigger className="mt-1 bg-[#2A2A2A] border-[#3A3A3A] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Modal Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="bg-[#2A2A2A] border-[#3A3A3A] hover:bg-[#3A3A3A]">
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={
              isLoading ||
              !formData.name.trim() ||
              formData.price <= 0 ||
              formData.categories.length === 0 ||
              formData.ingredients.length === 0 ||
              formData.ingredients.some((ing) => ing.id <= 0 || ing.quantity <= 0)
            }
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            {(() => {
              if (isLoading) return "Saving...";
              return selectedMenu?.id ? "Update Menu" : "Create Menu";
            })()}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default MenuModal;
