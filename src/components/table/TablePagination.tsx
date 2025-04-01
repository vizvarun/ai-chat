import React from "react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  // Generate page buttons
  const renderPaginationButtons = () => {
    const buttons = [];

    // Previous button
    buttons.push(
      <button
        key="prev"
        className="pagination-button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
    );

    // First page
    buttons.push(
      <button
        key={1}
        className={`pagination-button ${currentPage === 1 ? "active" : ""}`}
        onClick={() => onPageChange(1)}
      >
        1
      </button>
    );

    // Ellipsis or pages
    if (totalPages > 7) {
      if (currentPage > 3) {
        buttons.push(
          <span key="ellipsis-1" className="pagination-ellipsis">
            ...
          </span>
        );
      }

      // Pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          buttons.push(
            <button
              key={i}
              className={`pagination-button ${
                currentPage === i ? "active" : ""
              }`}
              onClick={() => onPageChange(i)}
            >
              {i}
            </button>
          );
        }
      }

      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="ellipsis-2" className="pagination-ellipsis">
            ...
          </span>
        );
      }
    } else {
      // Show all pages if total pages <= 7
      for (let i = 2; i < totalPages; i++) {
        buttons.push(
          <button
            key={i}
            className={`pagination-button ${currentPage === i ? "active" : ""}`}
            onClick={() => onPageChange(i)}
          >
            {i}
          </button>
        );
      }
    }

    // Last page (if more than 1 page)
    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          className={`pagination-button ${
            currentPage === totalPages ? "active" : ""
          }`}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        className="pagination-button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    );

    return buttons;
  };

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing {(currentPage - 1) * pageSize + 1} to{" "}
        {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
        <div className="page-size-selector">
          <label htmlFor="page-size">Show:</label>
          <select id="page-size" value={pageSize} onChange={onPageSizeChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="pagination-controls">{renderPaginationButtons()}</div>
    </div>
  );
};

export default TablePagination;
