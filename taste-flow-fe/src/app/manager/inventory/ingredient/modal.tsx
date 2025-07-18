import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ingredient, IngredientCategory, IngredientFormData } from "@/interfaces/ingredient.interface";
import React from "react";

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: IngredientFormData;
  setFormData: (data: IngredientFormData) => void;
  validationErrors: string[];
  isLoading: boolean;
  selectedIngredient: Ingredient | null;
  categories: IngredientCategory[];
}

const IngredientModal: React.FC<IngredientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  formData,
  setFormData,
  validationErrors,
  isLoading,
  selectedIngredient,
  categories,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={selectedIngredient?.id ? "Edit Ingredient" : "Add New Ingredient"} className="max-w-lg">
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
              Ingredient Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter ingredient name"
              className="mt-1 bg-[#2A2A2A] border-[#3A3A3A] text-white"
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <Label htmlFor="category" className="text-white">
              IngredientCategory *
            </Label>
            <Select
              value={formData.category.toString() || "0"}
              onValueChange={(value) => setFormData({ ...formData, category: parseInt(value) || 0 })}
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
            <p className="text-xs text-gray-400 mt-1">Select one category for the ingredient</p>
          </div>
          <div>
            <Label htmlFor="unit" className="text-white">
              Unit *
            </Label>
            <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })} disabled={isLoading}>
              <SelectTrigger className="mt-1 bg-[#2A2A2A] border-[#3A3A3A] text-white">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                <SelectItem value="GRAM">Gram</SelectItem>
                <SelectItem value="KILOGRAM">Kilogram</SelectItem>
                <SelectItem value="LITER">Liter</SelectItem>
                <SelectItem value="MILLILITER">Milliliter</SelectItem>
                <SelectItem value="UNIT">Unit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-white">Status</Label>
            <Select
              value={formData.active ? "true" : "false"}
              onValueChange={(value) => setFormData({ ...formData, active: value === "active" })}
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
            disabled={isLoading || !formData.name.trim() || formData.category <= 0 || !formData.unit.trim()}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            {(() => {
              if (isLoading) return "Saving...";
              return selectedIngredient?.id ? "Update Ingredient" : "Create Ingredient";
            })()}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default IngredientModal;
