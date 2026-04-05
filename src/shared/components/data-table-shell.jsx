import { useTranslation } from 'react-i18next'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState } from '@/shared/components/empty-state'

export function DataTableShell({
  columns,
  data,
  toolbar,
  filters,
  pagination,
  loading = false,
  emptyTitle,
  emptyDescription,
}) {
  const { t } = useTranslation('common')

  return (
    <div className="border-border/70 bg-card space-y-4 rounded-3xl border p-4 shadow-sm sm:p-6">
      {toolbar ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {toolbar}
        </div>
      ) : null}
      {filters ? (
        <div className="flex flex-wrap items-center gap-3">{filters}</div>
      ) : null}
      <div className="border-border/70 overflow-hidden rounded-2xl border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {columns.map((column) => (
                <TableHead key={column.key}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-32 text-center"
                >
                  {t('comingSoon')}
                </TableCell>
              </TableRow>
            ) : data.length ? (
              data.map((row, rowIndex) => (
                <TableRow key={row.id ?? rowIndex}>
                  {columns.map((column) => (
                    <TableCell key={`${column.key}-${row.id ?? rowIndex}`}>
                      {column.cell ? column.cell(row) : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-0">
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination ?? (
        <div className="text-muted-foreground text-sm">
          {t('table.rows')}: {data.length}
        </div>
      )}
    </div>
  )
}
