import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table"

interface UseTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
}

export function useTable<TData>({ data, columns }: UseTableProps<TData>) {
  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })
} 