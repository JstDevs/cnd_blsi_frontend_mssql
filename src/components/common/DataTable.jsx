import { useState } from 'react';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid';

function DataTable({
  columns,
  data = [],
  pagination = true,
  search = true,
  actions = [],
  loading = false,
  onRowClick = null,
  emptyMessage = 'No data available',
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Ensure data is an array
  const safeData = Array.isArray(data) ? data : [];

  // Search functionality
  const filteredData = safeData.filter((item) =>
    Object.values(item).some(
      (value) =>
        value !== null &&
        value !== undefined &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sorting functionality
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Sort handler
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Search handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg border border-neutral-200">
        <div className="px-4 py-5 sm:p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <h3 className="mt-2 text-lg font-medium text-neutral-900">
            Loading...
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Please wait while we fetch the data.
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (safeData.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg border border-neutral-200">
        <div className="px-4 py-5 sm:p-6 text-center">
          <svg
            className="mx-auto h-12 w-12 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-neutral-900">
            No data available
          </h3>
          <p className="mt-1 text-sm text-neutral-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border border-neutral-200 overflow-hidden">
      {search && (
        <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-neutral-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-12 py-2 sm:text-sm border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer whitespace-nowrap" // Added whitespace-nowrap
                  onClick={() =>
                    column.sortable !== false && requestSort(column.key)
                  }
                >
                  <div className="flex items-center gap-1">
                    {' '}
                    {/* Changed space-x-1 to gap-1 for better consistency */}
                    <span>{column.header}</span>
                    {column.sortable !== false && (
                      <span className="flex flex-col shrink-0">
                        {' '}
                        {/* Added shrink-0 to prevent icons from shrinking */}
                        <ChevronUpIcon
                          className={`h-3 w-3 ${
                            sortConfig.key === column.key &&
                            sortConfig.direction === 'asc'
                              ? 'text-primary-600'
                              : 'text-neutral-400'
                          }`}
                        />
                        <ChevronDownIcon
                          className={`h-3 w-3 -mt-1 ${
                            sortConfig.key === column.key &&
                            sortConfig.direction === 'desc'
                              ? 'text-primary-600'
                              : 'text-neutral-400'
                          }`}
                        />
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                >
                  <span>Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className={
                  onRowClick ? 'hover:bg-neutral-50 cursor-pointer' : ''
                }
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column) => (
                  <td
                    key={`${row.id || rowIndex}-${column.key}`}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      column.className || 'text-neutral-500'
                    }`}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}

                {typeof actions === 'function'
                  ? (() => {
                      const rowActions = actions(row);
                      return (
                        rowActions?.length > 0 && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            {rowActions.map((action, i) => (
                              <button
                                key={i}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(row);
                                }}
                                className={
                                  action.className ||
                                  'text-primary-600 hover:text-primary-900'
                                }
                                title={action.title}
                              >
                                {action.icon ? (
                                  <action.icon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  action.label
                                )}
                              </button>
                            ))}
                          </td>
                        )
                      );
                    })()
                  : actions.length > 0 && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {actions.map((action, i) => (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(row);
                            }}
                            className={
                              action?.className ||
                              'text-primary-600 hover:text-primary-900'
                            }
                            title={action?.title}
                          >
                            {action?.icon ? (
                              <action.icon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              action?.label
                            )}
                          </button>
                        ))}
                      </td>
                    )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 0 && (
        <div className="px-2 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-neutral-200 bg-neutral-50 sm:px-6">
          {/* Pagination Summary */}
          <div className="text-sm text-neutral-700 text-center sm:text-left">
            Showing{' '}
            <span className="font-medium">
              {Math.min((currentPage - 1) * rowsPerPage + 1, sortedData.length)}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(currentPage * rowsPerPage, sortedData.length)}
            </span>{' '}
            of <span className="font-medium">{sortedData.length}</span> results
          </div>

          {/* Controls: Rows per page + Buttons */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end sm:gap-4 gap-1">
            {/* Rows per page */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="rows-per-page"
                className="text-sm text-neutral-700 whitespace-nowrap"
              >
                Rows per page
              </label>
              <select
                id="rows-per-page"
                name="rows-per-page"
                className="block w-auto pl-3 pr-8 py-1 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
              >
                {[5, 10, 25, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Pagination Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center px-2 py-2 rounded-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-2 py-2 rounded-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default DataTable;
