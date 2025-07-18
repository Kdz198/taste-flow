"use client";

import { SearchIcon, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchOption {
  value: string;
  label: string;
}

interface SearchBarProps {
  onSearchChange: (searchValue: string) => void; // Chỉ trả về giá trị tìm kiếm
  className?: string;
  placeholder?: string;
  limitedFields?: boolean; // Hiển thị thông tin về các trường được tìm kiếm
  resetPagination?: () => void; // Thêm prop để reset pagination
}

function SearchBar({ searchOptions, onSearchChange, className, placeholder = "Tìm kiếm...", limitedFields = true, resetPagination }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange(value);
    // Reset về trang 1 khi tìm kiếm
    if (resetPagination) {
      resetPagination();
    }
  };

  const handleClear = () => {
    setSearchValue("");
    onSearchChange("");
    // Reset về trang 1 khi xóa tìm kiếm
    if (resetPagination) {
      resetPagination();
    }
  };

  // Hiển thị các trường có thể tìm kiếm

  return (
    <div className={cn("space-y-3", className)}>
      {/* Main search input */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xl border border-gray-300 rounded-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <SearchIcon className="absolute left-3  top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="text" placeholder={placeholder} value={searchValue} onChange={(e) => handleSearchChange(e.target.value)} className="pl-10" />
        </div>

        {/* Clear button */}
        {searchValue && (
          <Button variant="outline" size="sm" onClick={handleClear} className="gap-2">
            <X className="h-4 w-4" />
            Xóa
          </Button>
        )}
      </div>
    </div>
  );
}

export { SearchBar, type SearchBarProps, type SearchOption };
