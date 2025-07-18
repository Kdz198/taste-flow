import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ingredient, IngredientDetailFormData } from "@/interfaces/ingredient.interface";
import React from "react";

interface IngredientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: IngredientDetailFormData;
  setFormData: (data: IngredientDetailFormData) => void;
  validationErrors: string[];
  isLoading: boolean;
  selectedIngredientDetail: { id?: number } | null;
  ingredients: Ingredient[];
}

const IngredientDetailModal: React.FC<IngredientDetailModalProps> = ({
  isOpen,
  onClose,
  onSave,
  formData,
  setFormData,
  validationErrors,
  isLoading,
  selectedIngredientDetail,
}) => {
  const handleDateChange = (field: "entryDate" | "expireDate", value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Hàm hỗ trợ để chuẩn hóa giá trị ngày
  const formatDateForInput = (date: string | null | undefined) => {
    if (!date) return ""; // Trả về chuỗi rỗng nếu date là null hoặc undefined
    return date.split("T")[0]; // Chỉ lấy phần YYYY-MM-DD
  };

  console.log("IngredientDetailModal formData:", formData);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedIngredientDetail?.id ? "Edit Ingredient Detail" : "Add Ingredient Detail"}
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
            <Label htmlFor="expireDate" className="text-white">
              Expire Date *
            </Label>
            <Input
              id="expireDate"
              type="date"
              value={formatDateForInput(formData.expireDate)} // Sử dụng hàm format
              onChange={(e) => handleDateChange("expireDate", e.target.value)}
              className="mt-1 bg-[#2A2A2A] border-[#3A3A3A] text-white"
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <Label htmlFor="quantity" className="text-white">
              Quantity *
            </Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
              placeholder="Enter quantity"
              className="mt-1 bg-[#2A2A2A] border-[#3A3A3A] text-white"
              disabled={isLoading}
              min="0"
              step="0.01"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Unit: {formData.ingredient.unit || "GRAM"}</p>
          </div>
          <div>
            <Label className="text-white">Status</Label>
            <Select
              value={formData.active ? "active" : "inactive"}
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
            disabled={isLoading || formData.ingredient.id <= 0 || !formData.expireDate || formData.quantity <= 0}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            {isLoading ? "Saving..." : selectedIngredientDetail?.id ? "Update Ingredient Detail" : "Create Ingredient Detail"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default IngredientDetailModal;
