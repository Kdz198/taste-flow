
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserStatus } from "@/utils/type";
import { BookOpen, ChefHat, DollarSign, ImageIcon, Package, Star } from "lucide-react";
import React from "react";

interface Category {
  id: string;
  name: string;
  status?: boolean;
}

interface DishFormData {
  name: string;
  price: number;
  status: UserStatus;
  category: string[];
  receipt: string[];
  image: string;
}

interface DishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: DishFormData;
  setFormData: (data: DishFormData) => void;
  validationErrors: string[];
  isLoading: boolean;
  selectedDish: { id?: string } | null;
  categories: Category[];
}

const DishModal: React.FC<DishModalProps> = ({
  isOpen,
  onClose,
  onSave,
  formData,
  setFormData,
  validationErrors,
  isLoading,
  selectedDish,
  categories,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={selectedDish?.id ? "Edit Dish" : "Create New Dish"} className="max-w-4xl">
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
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="bg-[#2A2A2A] border-[#3A3A3A] hover:bg-[#3A3A3A]">
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={isLoading || !formData.name.trim() || formData.price <= 0}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            {isLoading ? "Saving..." : selectedDish?.id ? "Update Dish" : "Create Dish"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DishModal;
