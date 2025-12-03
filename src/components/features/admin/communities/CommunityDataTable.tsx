'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getColumns } from '@/components/features/admin/communities/columns'
import { SearchCommunityResult } from '@/types/services/community'
import { communityService } from '@/modules/services/community-service'
import { useDebounce } from '@/hooks/useDebounce'
import CommunityDetailsPanel from '@/components/features/admin/communities/CommunityDetailsPanel'

export function CommunityDataTable() {
  const [data, setData] = useState<SearchCommunityResult[]>([])
  const [loading, setLoading] = useState(true)

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})

  // selection state
  const [selectedCommunity, setSelectedCommunity] = useState<SearchCommunityResult | null>(null)

  // search query state + debounce
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 400)

  // fetchData uses communityService.searchCommunitiesAdmin to populate data
  const fetchData = useCallback(async (q?: string) => {
    setLoading(true)
    try {
      const resp = await communityService.searchCommunitiesAdmin(q, undefined, 50, 'newest')
      if (resp && Array.isArray(resp.communities)) {
        setData(resp.communities)
      } else {
        setData([])
      }
    } catch (error) {
      toast.error('Failed to fetch community list.')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  // call API when debounced query changes (includes initial empty string)
  useEffect(() => {
    fetchData(debouncedQuery)
  }, [debouncedQuery, fetchData])

  // pass fetchData as refresh callback to columns so actions can re-fetch
  const columns = useMemo(
    () => getColumns(() => fetchData(debouncedQuery)),
    [fetchData, debouncedQuery]
  )

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
  })

  return (
    <div className='w-full space-y-4'>
      <div className='flex items-center'>
        <Input
          placeholder='Filter by name...'
          value={query}
          onChange={(event) => {
            const v = event.target.value
            setQuery(v)
            // keep local column filter for immediate UI filtering while waiting for server
            table.getColumn('name')?.setFilterValue(v)
          }}
          className='max-w-sm'
        />
      </div>

      {/* Table (full width) */}
      <div className='rounded-md border overflow-hidden'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  Loading communities...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`cursor-pointer ${
                    selectedCommunity === row.original ? 'bg-surface/10' : 'hover:bg-muted/5'
                  }`}
                  onClick={(e) => {
                    // avoid selecting row when clicking interactive controls inside it
                    const target = e.target as HTMLElement
                    if (target.closest('button, a, input, textarea, select, [role="menuitem"]'))
                      return
                    setSelectedCommunity(row.original as SearchCommunityResult)
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No communities found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className='flex items-center justify-end space-x-2 py-4 px-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <hr />

      {/* Details panel below the table */}
      <div className='w-full mt-4 border-1 p-4 rounded-lg'>
        <CommunityDetailsPanel
          community={selectedCommunity}
          onClose={() => setSelectedCommunity(null)}
        />
      </div>
    </div>
  )
}
