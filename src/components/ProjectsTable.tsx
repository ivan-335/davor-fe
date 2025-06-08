import React, { useState, useEffect, useMemo, type JSX } from 'react';
import {
    createColumnHelper,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import type { SortingState, ColumnFiltersState } from '@tanstack/react-table';
import type { Project } from '../types/Project';
import { Status as StatusCode } from '../types/Project';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

interface ProjectTableProps {
    data?: Project[];
    onEdit: (project: Project) => void;
    onDelete: (project: Project) => void;
    searchValue: string;
    onSearchChange: (newSearch: string) => void;
    pageIndex: number;
    onPageChange: (newPage: number) => void;
    pageSize: number;
}
const columnHelper = createColumnHelper<Project>();
function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState<T>(value);
    useEffect(() => {
        const handle = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handle);
    }, [value, delay]);
    return debounced;
}
export default function ProjectsTable({
    data = [],
    onEdit,
    onDelete,
    searchValue,
    onSearchChange,
    pageIndex,
    onPageChange,
    pageSize,
}: ProjectTableProps): JSX.Element {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 6,
    });

    const columns = useMemo(
        () => [
            columnHelper.accessor('title', {
                header: 'Title',
                cell: (info) => info.getValue(),
                enableSorting: true,
                enableColumnFilter: true,
            }),
            columnHelper.accessor('status', {
                id: 'status',
                header: 'Status',
                cell: (info) => {
                    const code = info.getValue() as StatusCode;
                    const label = (() => {
                        switch (code) {
                            case StatusCode.Active:
                                return 'Active';
                            case StatusCode.OnHold:
                                return 'On Hold';
                            case StatusCode.InProgress:
                                return 'In Progress';
                            case StatusCode.Completed:
                                return 'Completed';
                            default:
                                return '';
                        }
                    })();
                    return (
                        <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${code === StatusCode.Active
                                ? 'bg-green-100 text-green-800'
                                : code === StatusCode.OnHold
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : code === StatusCode.InProgress
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                        >
                            {label}
                        </span>
                    );
                },
                enableSorting: false,
                enableColumnFilter: true,
                filterFn: 'equals',
            }),

            columnHelper.accessor('user', {
                header: 'Owner',
                cell: (info) => {
                    const user = info.getValue() as { _id: string; email: string } | null;
                    return user ? user.email : '—';
                },
                enableSorting: true,
                enableColumnFilter: true,
            }),
            columnHelper.accessor('deadline', {
                header: 'Deadline',
                cell: (info) =>
                    info.getValue()
                        ? new Date(info.getValue()).toLocaleDateString()
                        : '—',
                enableSorting: true,
            }),
            columnHelper.accessor('budget', {
                header: 'Budget',
                cell: (info) => info.getValue(),
                enableSorting: true,
                enableColumnFilter: true,
            }),
            columnHelper.accessor('createdAt', {
                header: 'Created On',
                cell: (info) =>
                    new Date(info.getValue()).toLocaleDateString(),
                enableSorting: true,
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={() => onEdit(row.original)}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <FiEdit2 />
                        </button>
                        <button
                            onClick={() => onDelete(row.original)}
                            className="text-red-600 hover:text-red-800"
                        >
                            <FiTrash2 />
                        </button>
                    </div>
                ),
                enableSorting: false,
            }),
        ],
        [onEdit, onDelete]
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
            columnFilters,
            pagination: {
                pageIndex: pageIndex - 1,
                pageSize
            },
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: 'includesString',
    });
    const [searchInput, setSearchInput] = useState<string>('');
    const debouncedSearch = useDebounce<string>(searchInput, 200);

    const tableRef = React.useRef<any>(null);
    useEffect(() => {
        if (tableRef.current) {
            tableRef.current.setPageIndex(0);
            setGlobalFilter(debouncedSearch);
        }
    }, [debouncedSearch]);

    return (
        <div className="bg-white text-gray-500 rounded-lg shadow-lg p-2 w-full">
            <div className="mb-12">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchValue}
                    onChange={(e) => {
                        onSearchChange(e.target.value)
                        setSearchInput(e.target.value);
                    }}
                    className="w-full border border-gray-300 rounded px-5 py-2 focus:outline-none focus:ring focus:border-green-300"
                />
            </div>

            <div className="overflow-x-auto w-full">
                <table className="w-full min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        className="px-6 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer select-none"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center gap-1">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: '↑',
                                                desc: '↓',
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}

                        {data.length === 0 && (
                            <tr>
                                <td colSpan={columns?.length ?? 1} className="px-6 py-4 text-center text-gray-500">
                                    No projects found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="m-6 flex items-center justify-between">
                <button
                    onClick={() => onPageChange(pageIndex - 1)}
                    disabled={!table.getCanPreviousPage()}
                    className={`px-4 py-2 rounded ${!table.getCanPreviousPage()
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    Previous
                </button>

                <span className="text-sm text-gray-700">
                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                </span>

                <button
                    onClick={() => onPageChange(pageIndex + 1)}
                    disabled={!table.getCanNextPage()}
                    className={`px-4 py-2 rounded ${!table.getCanNextPage()
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

