"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as React from "react";

type SortDirection = "asc" | "desc" | "none";

interface SortButtonProps extends Omit<React.ComponentProps<typeof Button>, "onChange"> {
  onChange?: (direction: SortDirection) => void;
  direction?: SortDirection;
  label?: string;
  children?: React.ReactNode;
}

// Custom Sort Icon với kích thước lớn hơn
const CustomSortIcon = ({ direction, className }: { direction?: SortDirection; className?: string }) => {
  const baseSize = 6; // Tăng kích thước lên 1.5 lần so với size-4 (4px)
  const opacityUp = direction === "desc" ? 0.3 : 1;
  const opacityDown = direction === "asc" ? 0.3 : 1;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className={className} width={baseSize} height={baseSize} fill="currentColor">
      <path d="M5 6 L8 2 L11 6 Z" opacity={opacityUp} />
      <path d="M5 10 L8 14 L11 10 Z" opacity={opacityDown} />
    </svg>
  );
};

// Tách function để render icon
const renderSortIcon = (direction: SortDirection) => {
  return <CustomSortIcon direction={direction} className="size-6" />; // Tăng size-4 thành size-6
};

// Tách function để get aria label
const getSortAriaLabel = (direction: SortDirection) => {
  if (direction === "none") return "Sort";
  if (direction === "asc") return "Sort ascending";
  return "Sort descending";
};

// Tách function để tính next direction
const getNextDirection = (currentDirection: SortDirection): SortDirection => {
  if (currentDirection === "none") return "asc";
  if (currentDirection === "asc") return "desc";
  return "none";
};

export function SortButton({ onChange, direction: externalDirection, label, className, children, ...props }: Readonly<SortButtonProps>) {
  const [internalDirection, setInternalDirection] = React.useState<SortDirection>("none");

  // Use external direction if provided, otherwise use internal state
  const direction = externalDirection ?? internalDirection;

  const handleClick = () => {
    const newDirection = getNextDirection(direction);
    setInternalDirection(newDirection);
    onChange?.(newDirection);
  };

  // Sử dụng children hoặc label nếu có
  const displayLabel = children || label;

  return (
    <div className="flex items-center gap-2">
      <span className="whitespace-nowrap">{displayLabel}</span>
      <Button variant="ghost" size="icon" className={cn("ml-1 h-6 w-6 p-0", className)} onClick={handleClick} {...props}>
        {renderSortIcon(direction)}
        <span className="sr-only">{getSortAriaLabel(direction)}</span>
      </Button>
    </div>
  );
}
