"use client";


import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { adminService } from "@/modules/services/admin-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { getColumns } from "@/components/features/admin/communities/columns";
import { Community } from "@/types/services/community";


export function CommunityDataTable() {
  const [ data, setData ] = useState<Community[]>([]);
  const [ loading, setLoading ] = useState(true);

  const [ sorting, setSorting ] = useState<SortingState>([]);
  const [ columnFilters, setColumnFilters ] = useState<ColumnFiltersState>([]);
  const [ rowSelection, setRowSelection ] = useState({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.adminGetAllCommunities();
      setData(response.communities);
    } catch (error) {
      toast.error("Failed to fetch community list.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [ fetchData ]);

  const columns = useMemo(() => getColumns(fetchData), [ fetchData ]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, rowSelection },
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center">
        <Input
          placeholder="Filter by name..."
          value={ (table.getColumn("name")?.getFilterValue() as string) ?? "" }
          onChange={ (event) => table.getColumn("name")?.setFilterValue(event.target.value) }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {
              table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={ headerGroup.id }
                >
                  {
                    headerGroup.headers.map(
                      (header) => (
                        <TableHead
                          key={ header.id }
                        >
                          { flexRender(header.column.columnDef.header, header.getContext()) }
                        </TableHead>
                      )
                    )
                  }
                </TableRow>
              ))
            }
          </TableHeader>
          <TableBody>
            {
              loading ? (
                <TableRow>
                  <TableCell
                    colSpan={ columns.length }
                    className="h-24 text-center"
                  >
                    Loading communities...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={ row.id }
                  >
                    {
                      row.getVisibleCells().map(
                        (cell) => (
                          <TableCell
                            key={ cell.id }
                          >
                            { flexRender(cell.column.columnDef.cell, cell.getContext()) }
                          </TableCell>
                        )
                      )
                    }
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={ columns.length }
                    className="h-24 text-center"
                  >
                    No communities found.
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={ () => table.previousPage() }
          disabled={ !table.getCanPreviousPage() }
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={ () => table.nextPage() }
          disabled={ !table.getCanNextPage() }
        >
          Next
        </Button>
      </div>
    </div>
  )
}
