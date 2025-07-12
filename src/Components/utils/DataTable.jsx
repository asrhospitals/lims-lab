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

const DataTable = ({
  items = [],
  columns = [],
  itemsPerPage = 5,
  defaultSorter = { column: "status", state: "asc" },
  showDetailsButtons = true,
  onUpdate,
}) => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const [sorting, setSorting] = useState([
    { id: defaultSorter.column, desc: defaultSorter.state === "desc" },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: itemsPerPage,
  });

  const transformedColumns = useMemo(() => {
    return columns.map((col) => ({
      id: col.key,
      accessorKey: col.key,
      header: col.label,
      cell: (info) => info.getValue(),
      size: col.size || 90, // default fixed width if not specified
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
          <button
            className="text-sm text-white bg-teal-600 hover:bg-teal-700 px-2 py-1 rounded"
            onClick={() => onUpdate && onUpdate(row.original)}
          >
            Update
          </button>
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
    [transformedColumns, expandedRows, onUpdate, showDetailsButtons]
  );

  const table = useReactTable({
    data: items,
    columns: baseColumns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
                  style={{ minWidth: header.column.getSize() }} // Apply column width
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
                className={`cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-y-[1.05] hover:bg-blue-50 hover:shadow-md ${
                  selectedRow?.id === row.original.id ? "bg-blue-100" : ""
                }`}
                onClick={() => setSelectedRow(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 text-left"
                    style={{ width: cell.column.getSize() }} // Apply column width
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {expandedRows.includes(row.original.id) && (
                <tr className="bg-gray-50">
                  <td
                    colSpan={row.getVisibleCells().length}
                    className="px-4 py-4"
                  >
                    <div>
                      <h4 className="text-lg font-semibold">
                        {row.original.dptName || row.original.name}
                      </h4>
                      <p className="text-gray-600">ID: {row.original.id}</p>
                      <div className="mt-2 space-x-2">
                        <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded">
                          Settings
                        </button>
                        <button className="px-3 py-1 bg-red-500 text-white text-sm rounded">
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4">
        {/* Page Size */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Items per page:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
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

        {/* Page Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            {"«"}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            {"‹"}
          </button>
          {Array.from({ length: table.getPageCount() }, (_, i) => (
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
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            {"›"}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            {"»"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
