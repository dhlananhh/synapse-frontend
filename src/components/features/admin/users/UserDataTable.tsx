'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
} from '@tanstack/react-table'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/useDebounce'
import { getColumns } from '@/components/features/admin/users/columns'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Loader2, ChevronDown } from 'lucide-react'
import { authService } from '@/modules/services/auth-service'
import { AccountDetails } from '@/types/services/auth'
import { AccountLogsSection } from '@/components/features/admin/AccountLogsSection'
import { CommunitiesSection } from '@/components/features/admin/CommunitiesSection'

export function UserDataTable() {
  const [data, setData] = useState<AccountDetails[]>([])
  const [loading, setLoading] = useState(true)

  // server-side pagination state
  const [pageIndex, setPageIndex] = useState(0) // zero-based for UI
  const [pageSize, setPageSize] = useState(10)
  const [paginationMeta, setPaginationMeta] = useState<{
    currentPage: number
    totalPages: number
    totalRecords: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  } | null>(null)

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const [filterQuery, setFilterQuery] = useState('')
  const debouncedFilterQuery = useDebounce(filterQuery, 500)

  // selected account
  const [selectedAccount, setSelectedAccount] = useState<AccountDetails | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      // API expects 1-based page number
      const response = await authService.fetchAccounts({
        q: debouncedFilterQuery || undefined,
        page: pageIndex + 1,
        limit: pageSize,
      })
      // fetchAccounts returns { accounts, pagination }
      setData(response.accounts)
      setPaginationMeta(response.pagination ?? null)
    } catch (error) {
      toast.error('Failed to fetch the list of accounts.')
      console.error('Fetch Accounts Error:', error)
    } finally {
      setLoading(false)
    }
  }, [debouncedFilterQuery, pageIndex, pageSize])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const columns = useMemo(() => getColumns(fetchData), [fetchData])

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
    // keep client pagination in sync with server data length
    pageCount: paginationMeta?.totalPages ?? -1,
  })

  return (
    <div className='w-full space-y-4'>
      <div className='flex items-center gap-4'>
        <Input
          placeholder='Filter by email or username...'
          value={filterQuery}
          onChange={(event) => {
            setFilterQuery(event.target.value)
            setPageIndex(0) // reset to first page on filter change
          }}
          className='max-w-sm'
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns
              <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className='capitalize'
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  <div className='flex items-center justify-center gap-2 text-muted-foreground'>
                    <Loader2 className='h-5 w-5 animate-spin' />
                    <span>Loading accounts...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const account = row.original as AccountDetails
                const isSelected = selectedAccount?.id === account.id
                return (
                  <TableRow
                    key={row.id}
                    data-state={isSelected && 'selected'}
                    className={`transition-colors hover:bg-muted/50 cursor-pointer ${
                      isSelected ? 'bg-muted/30' : ''
                    }`}
                    onClick={() => setSelectedAccount(account)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No accounts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {paginationMeta
            ? `Page ${paginationMeta.currentPage} of ${paginationMeta.totalPages} — ${paginationMeta.totalRecords} records`
            : `${data.length} row(s)`}
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={loading || !(paginationMeta?.hasPreviousPage ?? pageIndex > 0)}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPageIndex((p) => p + 1)}
            disabled={loading || !(paginationMeta?.hasNextPage ?? data.length === pageSize)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Selected user details: account logs + communities */}
      {selectedAccount && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
          <AccountLogsSection accountDetails={selectedAccount} />
          <CommunitiesSection userId={selectedAccount.userId} />
        </div>
      )}
    </div>
  )
}
