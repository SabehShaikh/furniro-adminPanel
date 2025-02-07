"use client";

import { Button } from '@/components/ui/button';

type PaginationProps = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page); // Trigger page change only if it's different
    }
  };

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'default' : 'outline'}
          onClick={() => handlePageChange(page)}
          disabled={currentPage === page} // Disable the active page button
        >
          {page}
        </Button>
      ))}
    </div>
  );
}
