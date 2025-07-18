import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { IngredientCategoryFormData } from "@/interfaces/ingredient.interface";
import React from "react";

interface IngredientCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: IngredientCategoryFormData;
  setFormData: (data: IngredientCategoryFormData) => void;
  validationErrors: string[];
  isLoading: boolean;
  selectedCategory: { id?: number } | null;
}

const IngredientCategoryModal: React.FC<IngredientCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  formData,
  setFormData,
  validationErrors,
  isLoading,
  selectedCategory,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedCategory?.id ? "Edit Ingredient Category" : "Add New Ingredient Category"}
      className="max-w-lg"
    >
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
              Category Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter category name"
              className="mt-1 bg-[#2A2A2A] border-[#3A3A3A] text-white"
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter category description"
              className="mt-1 bg-[#2A2A2A] border-[#3A3A3A] text-white"
              disabled={isLoading}
              rows={4}
            />
          </div>
        </div>
        {/* Modal Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="bg-[#2A2A2A] border-[#3A3A3A] hover:bg-[#3A3A3A]">
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={isLoading || !formData.name.trim()}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            {isLoading ? "Saving..." : selectedCategory?.id ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default IngredientCategoryModal;
