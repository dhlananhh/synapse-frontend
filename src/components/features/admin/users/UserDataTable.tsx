"use client";


import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import {
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
import { useDebounce } from "@/hooks/useDebounce";
import { adminService } from "@/modules/services/admin-service";
import { getColumns } from "@/components/features/admin/users/columns";
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
import { UserProfile } from "@/types/services/user";


export function UserDataTable() {
  const [ data, setData ] = useState<UserProfile[]>([]);
  const [ loading, setLoading ] = useState(true);

  const [ sorting, setSorting ] = useState<SortingState>([]);
  const [ columnFilters, setColumnFilters ] = useState<ColumnFiltersState>([]);
  const [ columnVisibility, setColumnVisibility ] = useState<VisibilityState>({});
  const [ rowSelection, setRowSelection ] = useState({});

  const [ filterQuery, setFilterQuery ] = useState("");
  const debouncedFilterQuery = useDebounce(filterQuery, 500);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.adminGetAllUsers({ q: debouncedFilterQuery });
      setData(response.users);
    } catch (error) {
      toast.error("Failed to fetch the list of users.");
      console.error("Fetch Users Error:", error);
    } finally {
      setLoading(false);
    }
  }, [ debouncedFilterQuery ]);

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
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filter by email or username..."
          value={ filterQuery }
          onChange={ (event) => setFilterQuery(event.target.value) }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {
              table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={ column.id }
                    className="capitalize"
                    checked={ column.getIsVisible() }
                    onCheckedChange={ (value) => column.toggleVisibility(!!value) }
                  >
                    { column.id }
                  </DropdownMenuCheckboxItem>
                ))
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
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
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

      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          { table.getFilteredSelectedRowModel().rows.length } of { " " }
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
  );
}
