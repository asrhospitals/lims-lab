import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";

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

const WithoutActionTable = ({
  items = [],
  columns = [],
  itemsPerPage = 5,
  defaultSorter = { column: "status", state: "asc" },
  showDetailsButtons = true,
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

  const [pagination, setPagination] = useState({
    pageIndex: serverSidePagination ? currentPage - 1 : 0,
    pageSize: itemsPerPage,
  });

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
      cell: (info) => info.getValue(),
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
    [transformedColumns, expandedRows, showDetailsButtons]
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
    manualPagination: serverSidePagination,
    pageCount: serverSidePagination ? totalPages : undefined,
  });

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-300 text-sm text-left">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="px-4 py-2 font-bold text-gray-600 cursor-pointer select-none text-center"
                  style={{ minWidth: header.column.getSize() }}
                >
                  <div className="flex justify-start items-center">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <span className="ml-1">
                      {header.column.getIsSorted() === "asc" ? (
                        <FaSortUp className="ml-1 inline" />
                      ) : header.column.getIsSorted() === "desc" ? (
                        <FaSortDown className="ml-1 inline" />
                      ) : (
                        <FaSort className="ml-1 inline text-gray-400" />
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <React.Fragment key={row.original.id}>
              <tr
                className={`cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-y-[1.05] hover:bg-blue-50 hover:shadow-md 
                  }`}
                onClick={() => setSelectedRow(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 text-left"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {expandedRows.includes(row.original.id) && (
                <tr className="bg-gray-50">
                  <td colSpan={row.getVisibleCells().length} className="px-4 py-4">
                    {row.original.tests?.length > 0 ? (
                      row.original.tests.map((test) => (
                        <div
                          key={test.patient_test_id}
                          className="p-3 border rounded mb-2 bg-white shadow-sm"
                        >
                          <p className="font-semibold">{test.testname}</p>
                          <p className="text-sm text-gray-600">
                            Department: {test.department?.dptname || "N/A"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-semibold">Status:</span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getBadgeColor(
                                test.status
                              )}`}
                            >
                              {test.status || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-semibold">Rejection Reason:</span>
                            <span className="text-gray-700">
                              {test.rejection_reason ?? "None"}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No tests available</p>
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Items per page:</span>
          <select
            value={
              serverSidePagination
                ? itemsPerPage
                : table.getState().pagination.pageSize
            }
            onChange={(e) => {
              const newSize = Number(e.target.value);
              if (serverSidePagination) {
                onPageSizeChange && onPageSizeChange(newSize);
              } else {
                table.setPageSize(newSize);
              }
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

        <div className="text-sm text-gray-600">
          {serverSidePagination ? (
            <span>
              Page {currentPage} of {totalPages} ({totalItems} total items)
            </span>
          ) : (
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}({items.length} total items)
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              if (serverSidePagination) {
                onPageChange && onPageChange(1);
              } else {
                table.setPageIndex(0);
              }
            }}
            disabled={
              serverSidePagination
                ? currentPage === 1
                : !table.getCanPreviousPage()
            }
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            {"«"}
          </button>
          <button
            onClick={() => {
              if (serverSidePagination) {
                onPageChange && onPageChange(currentPage - 1);
              } else {
                table.previousPage();
              }
            }}
            disabled={
              serverSidePagination
                ? currentPage === 1
                : !table.getCanPreviousPage()
            }
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            {"‹"}
          </button>

          {serverSidePagination
            ? Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange && onPageChange(pageNum)}
                  className={`px-3 py-1 rounded border ${pageNum === currentPage
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
                className={`px-3 py-1 rounded border ${i === table.getState().pagination.pageIndex
                    ? "bg-teal-800 text-white"
                    : "bg-white text-gray-800"
                  }`}
              >
                {i + 1}
              </button>
            ))}

          <button
            onClick={() => {
              if (serverSidePagination) {
                onPageChange && onPageChange(currentPage + 1);
              } else {
                table.nextPage();
              }
            }}
            disabled={
              serverSidePagination
                ? currentPage === totalPages
                : !table.getCanNextPage()
            }
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            {"›"}
          </button>
          <button
            onClick={() => {
              if (serverSidePagination) {
                onPageChange && onPageChange(totalPages);
              } else {
                table.setPageIndex(table.getPageCount() - 1);
              }
            }}
            disabled={
              serverSidePagination
                ? currentPage === totalPages
                : !table.getCanNextPage()
            }
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            {"»"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithoutActionTable;
