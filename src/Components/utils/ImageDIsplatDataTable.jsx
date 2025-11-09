import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import { FaArrowRight, FaEye, FaEdit, FaTrash } from "react-icons/fa";

// Badge color utility
const getBadgeColor = (status) => {
  return (
    {
      Active: "bg-green-200 text-green-800",
      Inactive: "bg-red-200 text-gray-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Banned: "bg-red-100 text-red-800",
    }[status] || "bg-blue-100 text-blue-800"
  );
};

const ImageDIsplatDataTable = ({
  items = [],
  columns = [],
  itemsPerPage = 5,
  defaultSorter = { column: "status", state: "asc" },
  showDetailsButtons = true,
  onUpdate,
  onView, // New prop for view action
  // Server-side pagination props
  serverSidePagination = false,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
}) => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const [sorting, setSorting] = useState([
    { id: defaultSorter.column, desc: defaultSorter.state === "desc" },
  ]);

  // Use server-side pagination state or local state
  const [pagination, setPagination] = useState({
    pageIndex: serverSidePagination ? currentPage - 1 : 0,
    pageSize: itemsPerPage,
  });

  // Update local pagination state when server-side props change
  React.useEffect(() => {
    if (serverSidePagination) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: currentPage - 1,
      }));
    }
  }, [currentPage, serverSidePagination]);

const transformedColumns = useMemo(() => {
  return columns.map((col) => ({
    id: col.key,
    accessorKey: col.key,
    header: col.label,
    cell: (info) => (col.render ? col.render(info.row.original) : info.getValue()),
    size: col.size || 90,
  }));
}, [columns]);


  const toggleDetails = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const baseColumns = useMemo(
    () => [
      ...transformedColumns,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            {/* <button
              className="text-sm text-white bg-teal-600 hover:bg-teal-700 px-2 py-1 rounded"
              onClick={() => onUpdate && onUpdate(row.original)}
            >
              Update
            </button> */}
            <button
              className="p-2 bg-yellow-100 rounded-full hover:bg-yellow-200"
              onClick={() => onUpdate && onUpdate(row.original)}
            >
              <FaEdit className="text-yellow-600" />
            </button>

            {onView && ( // Conditionally render the View button
              <button
                className="text-sm text-white bg-teal-600 hover:bg-teal-700 px-2 py-1 rounded"
                onClick={() => onView(row.original)} // View button
              >
                View
              </button>
            )}
          </div>
        ),
      },
      ...(showDetailsButtons
        ? [
            {
              id: "toggle",
              header: "",
              cell: ({ row }) => (
                <button
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => toggleDetails(row.original.id)}
                >
                  {expandedRows.includes(row.original.id) ? "Hide" : "Show"}
                </button>
              ),
            },
          ]
        : []),
    ],
    [transformedColumns, expandedRows, onUpdate, onView, showDetailsButtons]
  );

  const table = useReactTable({
    data: items,
    columns: baseColumns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: serverSidePagination ? undefined : setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: serverSidePagination
      ? undefined
      : getPaginationRowModel(),
    // Server-side pagination config
    manualPagination: serverSidePagination,
    pageCount: serverSidePagination ? totalPages : undefined,
  });

  return (
    <div className="w-full overflow-x-auto border rounded-lg">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full table-fixed divide-y divide-gray-300 text-sm text-left">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-2 sm:px-4 py-2 font-bold text-gray-600 cursor-pointer select-none text-left break-words"
                    style={{
                      minWidth: "100px",
                      maxWidth: "250px",
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.original.id}
                className="hover:bg-blue-50 cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-2 sm:px-4 py-2 break-words"
                    style={{ maxWidth: "250px" }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4 p-4">
        {/* Page Size */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm whitespace-nowrap">Items per page:</span>
          <select
            value={
              serverSidePagination
                ? itemsPerPage
                : table.getState().pagination.pageSize
            }
            onChange={(e) => {
              const newSize = Number(e.target.value);
              if (serverSidePagination)
                onPageSizeChange && onPageSizeChange(newSize);
              else table.setPageSize(newSize);
            }}
            className="border rounded px-2 py-1"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Page Info */}
        <div className="text-sm text-gray-600 whitespace-nowrap">
          {serverSidePagination
            ? `Page ${currentPage} of ${totalPages} (${totalItems} total items)`
            : `Page ${
                table.getState().pagination.pageIndex + 1
              } of ${table.getPageCount()} (${items.length} total items)`}
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() =>
              serverSidePagination
                ? onPageChange && onPageChange(1)
                : table.setPageIndex(0)
            }
            disabled={
              serverSidePagination
                ? currentPage === 1
                : !table.getCanPreviousPage()
            }
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            «
          </button>
          <button
            onClick={() =>
              serverSidePagination
                ? onPageChange && onPageChange(currentPage - 1)
                : table.previousPage()
            }
            disabled={
              serverSidePagination
                ? currentPage === 1
                : !table.getCanPreviousPage()
            }
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            ‹
          </button>

          {serverSidePagination
            ? Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2)
                  pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange && onPageChange(pageNum)}
                    className={`px-3 py-1 rounded border ${
                      pageNum === currentPage
                        ? "bg-teal-800 text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })
            : Array.from({ length: table.getPageCount() }, (_, i) => (
                <button
                  key={i}
                  onClick={() => table.setPageIndex(i)}
                  className={`px-3 py-1 rounded border ${
                    i === table.getState().pagination.pageIndex
                      ? "bg-teal-800 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

          <button
            onClick={() =>
              serverSidePagination
                ? onPageChange && onPageChange(currentPage + 1)
                : table.nextPage()
            }
            disabled={
              serverSidePagination
                ? currentPage === totalPages
                : !table.getCanNextPage()
            }
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            ›
          </button>
          <button
            onClick={() =>
              serverSidePagination
                ? onPageChange && onPageChange(totalPages)
                : table.setPageIndex(table.getPageCount() - 1)
            }
            disabled={
              serverSidePagination
                ? currentPage === totalPages
                : !table.getCanNextPage()
            }
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageDIsplatDataTable;
