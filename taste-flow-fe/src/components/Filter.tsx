"use client";

import { ChevronDown, Filter as FilterIcon, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
  type: "select" | "dateRange" | "numberRange";
  selectOptions?: { value: string; label: string }[];
  placeholder?: string;
  numberRangeConfig?: {
    fromPlaceholder?: string;
    toPlaceholder?: string;
    min?: number;
    max?: number;
    step?: number;
    suffix?: string; // Đơn vị hiển thị như "đ", "kg", "cái"
  };
}

interface FilterCriteria {
  field: string;
  value: string | { from: Date | undefined; to: Date | undefined } | { from: number | undefined; to: number | undefined };
  label: string;
  type: "select" | "dateRange" | "numberRange";
}

// Tạo cấu trúc nhóm Filter
interface FilterGroup {
  name: string;
  label: string;
  options: FilterOption[];
}

interface FilterProps {
  filterOptions: FilterOption[] | FilterGroup[];
  onFilterChange: (criteria: FilterCriteria[]) => void;
  className?: string;
  showActiveFilters?: boolean;
  groupMode?: boolean; // Thêm flag để kiểm tra có dùng groupMode không
}

// Type for temp values
type TempFilterValue = string | { from: Date | undefined; to: Date | undefined } | { from: number | undefined; to: number | undefined } | undefined;

function Filter({ filterOptions, onFilterChange, className, showActiveFilters = true, groupMode = false }: FilterProps) {
  const [appliedFilters, setAppliedFilters] = useState<FilterCriteria[]>([]);
  const [tempValues, setTempValues] = useState<Record<string, TempFilterValue>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");

  // Kiểm tra nếu options được phân nhóm
  const isGrouped = groupMode && filterOptions.length > 0 && "name" in filterOptions[0];

  const filterGroups = useMemo(() => {
    return isGrouped ? (filterOptions as FilterGroup[]) : [];
  }, [isGrouped, filterOptions]);

  const flatOptions = isGrouped ? filterGroups.flatMap((group) => group.options) : (filterOptions as FilterOption[]);

  // Tạo defaultTab nếu dùng groupMode
  useEffect(() => {
    if (isGrouped && filterGroups.length > 0) {
      setActiveTab(filterGroups[0].name);
    }
  }, [isGrouped, filterGroups]);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Khi mở dropdown, load giá trị hiện tại vào temp
      const currentValues: Record<string, TempFilterValue> = {};
      appliedFilters.forEach((filter) => {
        currentValues[filter.field] = filter.value;
      });
      setTempValues(currentValues);
    }
    setIsOpen(open);
  };

  const handleTempValueChange = (field: string, value: TempFilterValue) => {
    setTempValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isValidFilter = (option: FilterOption, value: TempFilterValue): boolean => {
    if (option.type === "dateRange") {
      const range = value as { from: Date | undefined; to: Date | undefined };
      return Boolean(range && (range.from || range.to));
    }

    if (option.type === "numberRange") {
      const range = value as { from: number | undefined; to: number | undefined };
      return Boolean(range && (range.from !== undefined || range.to !== undefined));
    }

    return Boolean(value && value !== "");
  };

  // Sửa hàm handleApplyFilters để xử lý đúng flatOptions thay vì filterOptions
  const handleApplyFilters = () => {
    // Tạo danh sách filters từ các giá trị đã nhập
    const validFilters: FilterCriteria[] = [];

    // Sử dụng flatOptions thay vì filterOptions để chỉ làm việc với FilterOption
    flatOptions.forEach((option) => {
      const value = tempValues[option.value];

      if (isValidFilter(option, value)) {
        validFilters.push({
          field: option.value,
          value: value as string | { from: Date | undefined; to: Date | undefined } | { from: number | undefined; to: number | undefined },
          label: option.label,
          type: option.type,
        });
      }
    });

    setAppliedFilters(validFilters);
    onFilterChange(validFilters);
    setIsOpen(false);
  };

  const handleCancel = () => {
    // Reset temp values về applied values
    const currentValues: Record<string, TempFilterValue> = {};
    appliedFilters.forEach((filter) => {
      currentValues[filter.field] = filter.value;
    });
    setTempValues(currentValues);
    setIsOpen(false);
  };

  const handleClearAllFilters = () => {
    setAppliedFilters([]);
    setTempValues({});
    onFilterChange([]);
  };

  const handleRemoveAppliedFilter = (index: number) => {
    const newFilters = appliedFilters.filter((_, i) => i !== index);
    setAppliedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    return appliedFilters.length;
  };

  const renderDateRangeFilter = (option: FilterOption) => {
    const value = (tempValues[option.value] as { from: Date | undefined; to: Date | undefined }) || { from: undefined, to: undefined };
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium">{option.label}</div>
        <div className="flex gap-2">
          <div className="flex-1">
            <DatePicker date={value.from} setDate={(date) => handleTempValueChange(option.value, { ...value, from: date })} placeholder="Từ ngày" />
          </div>
          <div className="flex-1">
            <DatePicker date={value.to} setDate={(date) => handleTempValueChange(option.value, { ...value, to: date })} placeholder="Đến ngày" />
          </div>
        </div>
      </div>
    );
  };

  const renderNumberRangeFilter = (option: FilterOption) => {
    const value = (tempValues[option.value] as { from: number | undefined; to: number | undefined }) || { from: undefined, to: undefined };
    const config = option.numberRangeConfig || {};
    const { fromPlaceholder = "Từ giá trị", toPlaceholder = "Đến giá trị", min = 0, max, step = 1 } = config;

    return (
      <div className="space-y-2">
        <div className="text-sm font-medium">{option.label}</div>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="number"
              placeholder={fromPlaceholder}
              value={value.from ?? ""}
              onChange={(e) => {
                const num = e.target.value ? Number(e.target.value) : undefined;
                handleTempValueChange(option.value, { ...value, from: num });
              }}
              min={min}
              max={max}
              step={step}
            />
          </div>
          <div className="flex-1">
            <Input
              type="number"
              placeholder={toPlaceholder}
              value={value.to ?? ""}
              onChange={(e) => {
                const num = e.target.value ? Number(e.target.value) : undefined;
                handleTempValueChange(option.value, { ...value, to: num });
              }}
              min={min}
              max={max}
              step={step}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderSelectFilter = (option: FilterOption) => {
    const value = (tempValues[option.value] as string) || "";
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium">{option.label}</div>
        <Select value={value} onValueChange={(val) => handleTempValueChange(option.value, val)}>
          <SelectTrigger>
            <SelectValue placeholder={option.placeholder || `Chọn ${option.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {option.selectOptions ? (
              option.selectOptions.map((selectOption) => (
                <SelectItem key={selectOption.value} value={selectOption.value}>
                  {selectOption.label}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="" disabled>
                Không có lựa chọn
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    );
  };

  const hasAnyValues = () => {
    return Object.values(tempValues).some((value) => {
      if (typeof value === "object" && value !== null && value !== undefined) {
        if ("from" in value && "to" in value) {
          return value.from !== undefined || value.to !== undefined;
        }
      }
      return value && value !== "";
    });
  };

  const formatDateRange = (range: { from: Date | undefined; to: Date | undefined }): string => {
    const fromStr = range.from ? range.from.toLocaleDateString() : "";
    const toStr = range.to ? range.to.toLocaleDateString() : "";
    if (fromStr && toStr) return `: ${fromStr} - ${toStr}`;
    if (fromStr) return `: từ ${fromStr}`;
    if (toStr) return `: đến ${toStr}`;
    return "";
  };

  const formatNumberRange = (range: { from: number | undefined; to: number | undefined }, suffix: string): string => {
    const fromStr = range.from !== undefined ? range.from.toLocaleString() + suffix : "";
    const toStr = range.to !== undefined ? range.to.toLocaleString() + suffix : "";
    if (fromStr && toStr) return `: ${fromStr} - ${toStr}`;
    if (fromStr) return `: từ ${fromStr}`;
    if (toStr) return `: đến ${toStr}`;
    return "";
  };

  // Sửa hàm formatFilterValue để xử lý đúng với flatOptions
  const formatFilterValue = (filter: FilterCriteria): string => {
    switch (filter.type) {
      case "dateRange": {
        const range = filter.value as { from: Date | undefined; to: Date | undefined };
        return formatDateRange(range);
      }
      case "numberRange": {
        const range = filter.value as { from: number | undefined; to: number | undefined };
        // Tìm option tương ứng từ flatOptions thay vì filterOptions
        const option = flatOptions.find((opt) => opt.value === filter.field);
        const suffix = option?.numberRangeConfig?.suffix || "";
        return formatNumberRange(range, suffix);
      }
      default:
        return `: ${filter.value}`;
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Filter trigger button and clear button */}
      <div className="flex justify-end gap-2">
        {/* Clear all filters button - chỉ hiện khi có applied filters */}
        {appliedFilters.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearAllFilters} className="gap-1">
            <X className="h-3 w-3" />
            Xóa bộ lọc
          </Button>
        )}

        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <FilterIcon className="h-4 w-4" />
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                  {getActiveFiltersCount()}
                </Badge>
              )}
              <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", isOpen && "rotate-180")} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end" side="bottom">
            <div className="p-4">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-medium">Bộ lọc</h4>
                {hasAnyValues() && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTempValues({})}
                    className="text-muted-foreground hover:text-foreground h-auto p-1 text-xs"
                  >
                    Xóa tất cả
                  </Button>
                )}
              </div>

              {/* Filter inputs - hiển thị theo nhóm hoặc không */}
              {isGrouped ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-4 grid w-full" style={{ gridTemplateColumns: `repeat(${filterGroups.length}, 1fr)` }}>
                    {filterGroups.map((group) => (
                      <TabsTrigger key={group.name} value={group.name}>
                        {group.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {filterGroups.map((group) => (
                    <TabsContent key={group.name} value={group.name} className="max-h-80 space-y-4 overflow-y-auto">
                      {group.options.map((option) => (
                        <div key={option.value}>
                          {option.type === "dateRange" && renderDateRangeFilter(option)}
                          {option.type === "numberRange" && renderNumberRangeFilter(option)}
                          {option.type === "select" && renderSelectFilter(option)}
                        </div>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="max-h-80 space-y-4 overflow-y-auto">
                  {flatOptions.map((option) => (
                    <div key={option.value}>
                      {option.type === "dateRange" && renderDateRangeFilter(option)}
                      {option.type === "numberRange" && renderNumberRangeFilter(option)}
                      {option.type === "select" && renderSelectFilter(option)}
                    </div>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-4 flex items-center justify-end gap-2 border-t pt-4">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Hủy
                </Button>
                <Button size="sm" onClick={handleApplyFilters}>
                  Áp dụng
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Applied filters display */}
      {showActiveFilters && appliedFilters.length > 0 && (
        <div className="flex justify-end">
          <div className="flex max-w-3xl flex-wrap justify-end gap-2">
            {appliedFilters.map((filter, index) => (
              <Badge key={`applied-${filter.field}-${index}`} variant="secondary" className="flex items-center gap-1">
                <span className="text-xs">
                  {filter.label}
                  {formatFilterValue(filter)}
                </span>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveAppliedFilter(index)} className="hover:bg-destructive/20 h-3 w-3 p-0">
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { Filter, type FilterCriteria, type FilterGroup, type FilterOption, type FilterProps };
