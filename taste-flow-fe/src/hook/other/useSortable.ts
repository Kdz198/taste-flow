import * as React from "react";

export type SortDirection = "asc" | "desc" | "none";

// Helper functions để giảm Cognitive Complexity
const handleNullValues = (valueA: unknown, valueB: unknown, sortDirection: SortDirection) => {
  if (valueA === null || valueA === undefined) {
    return sortDirection === "asc" ? -1 : 1;
  }
  if (valueB === null || valueB === undefined) {
    return sortDirection === "asc" ? 1 : -1;
  }
  return null; // Không phải null values
};

const compareStrings = (valueA: string, valueB: string, sortDirection: SortDirection) => {
  return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
};

const compareOtherTypes = (valueA: unknown, valueB: unknown, sortDirection: SortDirection) => {
  // Type assertion để so sánh an toàn
  const a = valueA as string | number;
  const b = valueB as string | number;

  if (a < b) {
    return sortDirection === "asc" ? -1 : 1;
  }
  if (a > b) {
    return sortDirection === "asc" ? 1 : -1;
  }
  return 0;
};

// Chuyển các helper functions thành return string thay vì JSX
const getSortIconType = (column: string, sortField: string | null, sortOrder: string) => {
  if (column !== sortField) return "none";
  if (sortOrder === "asc") return "asc";
  return "desc";
};

const getAriaLabel = (column: string, sortField: string | null, sortOrder: string) => {
  if (column !== sortField) return `Sort by ${column}`;
  if (sortOrder === "asc") return `Sort by ${column} descending`;
  return `Sort by ${column} ascending`;
};

/**
 * A hook to manage sortable data collections
 */
export function useSortable<T>(initialData: T[]) {
  const [sortKey, setSortKey] = React.useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("none");

  // Sort the data based on current sort configuration
  const sortedData = React.useMemo(() => {
    if (sortDirection === "none" || !sortKey) {
      return initialData;
    }

    return [...initialData].sort((a, b) => {
      const valueA = a[sortKey];
      const valueB = b[sortKey];

      // Handle null/undefined values first
      const nullComparison = handleNullValues(valueA, valueB, sortDirection);
      if (nullComparison !== null) {
        return nullComparison;
      }

      // Handle different types
      if (typeof valueA === "string" && typeof valueB === "string") {
        return compareStrings(valueA, valueB, sortDirection);
      }

      // Handle numbers and other comparable types
      return compareOtherTypes(valueA, valueB, sortDirection);
    });
  }, [initialData, sortKey, sortDirection]);

  // Generate props for SortButton components
  const getSortProps = (key: keyof T) => ({
    direction: sortKey === key ? sortDirection : ("none" as SortDirection),
    onChange: (direction: SortDirection) => {
      setSortKey(direction === "none" ? null : key);
      setSortDirection(direction);
    },
  });

  return {
    sortedData,
    sortKey,
    sortDirection,
    getSortProps,
    getSortIconType,
    getAriaLabel,
  };
}
