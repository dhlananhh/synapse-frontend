"use client";


import * as React from "react";
import { adminService } from "@/modules/services/admin-service";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, ChevronDown } from "lucide-react";
import { AdminUser, getColumns } from "./columns";


export function UserDataTable() {
  const [ data, setData ] = React.useState<AdminUser[]>([]);
  const [ loading, setLoading ] = React.useState(true);

  const [ sorting, setSorting ] = React.useState<SortingState>([]);
  const [ columnFilters, setColumnFilters ] = React.useState<ColumnFiltersState>([]);
  const [ columnVisibility, setColumnVisibility ] = React.useState<VisibilityState>({});
  const [ rowSelection, setRowSelection ] = React.useState({});

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.adminGetAllUsers({ limit: 100 });
      setData(response.users);
    } catch (error) {
      toast.error("Failed to fetch the list of users.");
      console.error("Fetch Users Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);


  React.useEffect(() => {
    fetchData();
  }, [ fetchData ]);

  const columns = React.useMemo(() => getColumns(fetchData), [ fetchData ]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });


  return (
    <div className="w-full space-y-4">
      <div className="flex items-center">
        <Input
          placeholder="Filter by email..."
          value={
            (table.getColumn("email")?.getFilterValue() as string) ?? ""
          }
          onChange={
            (event) => table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {
              table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={ column.id }
                      className="capitalize"
                      checked={ column.getIsVisible() }
                      onCheckedChange={ (value) => column.toggleVisibility(!!value) }
                    >
                      { column.id }
                    </DropdownMenuCheckboxItem>
                  )
                })
            }
          </DropdownMenuContent>
        </DropdownMenu>
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
                    headerGroup.headers.map((header) => (
                      <TableHead
                        key={ header.id }
                      >
                        {
                          header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())
                        }
                      </TableHead>
                    ))
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
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
                      <span>Loading users...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={ row.id }
                    data-state={ row.getIsSelected() && "selected" }
                    className="transition-colors hover:bg-muted/50"
                  >
                    {
                      row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={ cell.id }
                        >
                          { flexRender(cell.column.columnDef.cell, cell.getContext()) }
                        </TableCell>
                      ))
                    }
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={ columns.length }
                    className="h-24 text-center"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          { table.getFilteredSelectedRowModel().rows.length } of{ " " }
          { table.getFilteredRowModel().rows.length } row(s) selected.
        </div>
        <div className="space-x-2">
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
    </div>
  )
}
