import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, MoreHorizontalIcon } from "lucide-react";
import * as React from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="pagination-content" className={cn("flex flex-row items-center gap-1", className)} {...props} />;
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({ className, isActive, size = "icon", ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to previous page" size="default" className={cn("gap-1 px-2.5 sm:pl-2.5", className)} {...props}>
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to next page" size="default" className={cn("gap-1 px-2.5 sm:pr-2.5", className)} {...props}>
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationFirst({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to first page" size="icon" className={cn("hidden h-8 w-8 lg:flex", className)} {...props}>
      <ChevronsLeftIcon className="h-4 w-4" />
      <span className="sr-only">Go to first page</span>
    </PaginationLink>
  );
}

function PaginationLast({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to last page" size="icon" className={cn("hidden h-8 w-8 lg:flex", className)} {...props}>
      <ChevronsRightIcon className="h-4 w-4" />
      <span className="sr-only">Go to last page</span>
    </PaginationLink>
  );
}

function PaginationJump({
  className,
  currentPage = 1,
  totalPages = 1,
  onJump,
  ...props
}: React.ComponentProps<"div"> & {
  currentPage?: number;
  totalPages?: number;
  onJump?: (page: number) => void;
}) {
  const [inputValue, setInputValue] = React.useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Chỉ cho phép nhập số
    const value = e.target.value.replace(/\D/g, "");
    setInputValue(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleJump();
    }
  };

  const handleJump = () => {
    if (!inputValue) return;

    const pageNumber = parseInt(inputValue, 10);
    if (isNaN(pageNumber)) return;

    // Đảm bảo số trang nằm trong phạm vi hợp lệ
    const validPage = Math.max(1, Math.min(pageNumber, totalPages));
    onJump?.(validPage);
    setInputValue("");
  };

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <Input
        type="text"
        placeholder="Go to"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="h-8 w-16 text-center text-sm"
        aria-label={`Jump to page (1-${totalPages})`}
      />
      <Button variant="outline" size="sm" onClick={handleJump} className="h-8 px-2 text-xs">
        Go
      </Button>
    </div>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span aria-hidden data-slot="pagination-ellipsis" className={cn("flex size-9 items-center justify-center", className)} {...props}>
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationJump,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
