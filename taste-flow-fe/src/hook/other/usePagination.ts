import { useCallback, useMemo, useState } from "react";

export interface PaginationConfig {
  initialPage?: number;
  totalCount: number;
  pageSize: number;
  maxVisiblePages?: number;
  onPageChange?: (page: number) => void;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  visiblePages: (number | "ellipsis")[];
}

export interface PaginationActions {
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  reset: () => void;
}

export interface UsePaginationReturn extends PaginationState, PaginationActions {}

export const usePagination = ({
  initialPage = 1,
  totalCount,
  pageSize,
  maxVisiblePages = 5,
  onPageChange,
}: PaginationConfig): UsePaginationReturn => {
  // Validate inputs
  if (totalCount < 0) throw new Error("totalCount must be non-negative");
  if (pageSize <= 0) throw new Error("pageSize must be positive");
  if (maxVisiblePages < 3) throw new Error("maxVisiblePages must be at least 3");

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Normalize initial page
  const normalizedInitialPage = Math.max(1, Math.min(initialPage, totalPages));

  // State management
  const [currentPage, setCurrentPage] = useState(normalizedInitialPage);

  // Memoized calculations
  const paginationState = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalCount - 1);

    return {
      startIndex,
      endIndex,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
  }, [currentPage, pageSize, totalCount, totalPages]);

  // Generate visible pages with ellipsis
  const visiblePages = useMemo((): (number | "ellipsis")[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [];
    const halfVisible = Math.floor((maxVisiblePages - 3) / 2); // Reserve space for first, last, and ellipsis

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    let startPage = Math.max(2, currentPage - halfVisible);
    let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

    // Adjust range if too close to boundaries
    if (startPage === 2 && endPage < totalPages - 1) {
      endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);
    }
    if (endPage === totalPages - 1 && startPage > 2) {
      startPage = Math.max(2, endPage - maxVisiblePages + 3);
    }

    // Add left ellipsis
    if (startPage > 2) {
      pages.push("ellipsis");
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add right ellipsis
    if (endPage < totalPages - 1) {
      pages.push("ellipsis");
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);

  // Actions
  const setPage = useCallback(
    (page: number) => {
      const newPage = Math.max(1, Math.min(page, totalPages));
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
        onPageChange?.(newPage);
      }
    },
    [currentPage, totalPages, onPageChange]
  );

  const nextPage = useCallback(() => {
    if (paginationState.hasNextPage) {
      setPage(currentPage + 1);
    }
  }, [currentPage, paginationState.hasNextPage, setPage]);

  const prevPage = useCallback(() => {
    if (paginationState.hasPrevPage) {
      setPage(currentPage - 1);
    }
  }, [currentPage, paginationState.hasPrevPage, setPage]);

  const goToFirstPage = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const goToLastPage = useCallback(() => {
    setPage(totalPages);
  }, [setPage, totalPages]);

  const reset = useCallback(() => {
    setPage(normalizedInitialPage);
  }, [setPage, normalizedInitialPage]);

  return {
    // State
    currentPage,
    totalPages,
    pageSize,
    totalCount,
    startIndex: paginationState.startIndex,
    endIndex: paginationState.endIndex,
    hasNextPage: paginationState.hasNextPage,
    hasPrevPage: paginationState.hasPrevPage,
    visiblePages,

    // Actions
    setPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    reset,
  };
};

// Utility function for generating page info text
export const getPageInfo = (state: PaginationState): string => {
  if (state.totalCount === 0) return "No items";
  const start = state.startIndex + 1;
  const end = state.endIndex + 1;
  return `${start}-${end} / ${state.totalCount}`;
};

// Helper hook for URL-based pagination
export const useUrlPagination = (
  config: Omit<PaginationConfig, "initialPage" | "onPageChange">,
  searchParams: URLSearchParams,
  setSearchParams: (params: URLSearchParams) => void,
  pageParam: string = "page"
) => {
  const initialPage = parseInt(searchParams.get(pageParam) || "1", 10);

  const onPageChange = useCallback(
    (page: number) => {
      const newParams = new URLSearchParams(searchParams);
      if (page === 1) {
        newParams.delete(pageParam);
      } else {
        newParams.set(pageParam, page.toString());
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams, pageParam]
  );

  return usePagination({
    ...config,
    initialPage,
    onPageChange,
  });
};
