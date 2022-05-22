/* eslint-disable react/jsx-key */
import React from 'react'
import { useTable } from 'react-table'
import type { Column, TableRowProps } from 'react-table'
import cx from 'classnames'

import s from './Table.module.scss'


// https://react-table.tanstack.com/docs/examples/data-driven-classes-and-styles
const defaultPropGetter = () => ({})

export type TableColumns<DataType> = {
  id: string
  Header: string | React.ReactElement
  accessor: (data: DataType, index: number) => React.ReactNode
  width?: number
  minWidth?: number
  maxWidth?: number
  Footer?: (data: DataType) => React.ReactNode
  Cell?: (data: DataType) => React.ReactNode
}[]

export type TableInstanceProps = {
  className?: string
  columns: Column<any>[]
  data: Record<string, any>[]
  getRowProps?: (row: any) => Partial<TableRowProps>
  onRowClick?: (row: any) => void
}

const TableInstance: React.FunctionComponent<TableInstanceProps> = (props) => {
  const { className, columns, data, getRowProps = defaultPropGetter, onRowClick } = props

  const tableInstance = useTable({ columns, data })

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance

  return (
    <table className={cx(s.table, className)} {...getTableProps()}>
      <thead>
        {
          headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {
                headerGroup.headers.map((column) => (
                  <th className={s.th} {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))
              }
            </tr>
          ))
        }
      </thead>
      <tbody {...getTableBodyProps()}>
        {
          rows.map((row) => {
            prepareRow(row)

            const { className, ...rest } = row.getRowProps(getRowProps(row))
            const handleClick = () => onRowClick && onRowClick(row)

            return (
              <tr
                className={cx(s.row, className)}
                {...rest}
                onClick={handleClick}
              >
                {
                  row.cells.map((cell) => {
                    return (
                      <td className={s.td} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </td>
                    )
                  })
                }
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}

export type TableProps = TableInstanceProps & {
  containerClassName?: string
  onRowClick?: (row: any) => void
}

const Table: React.FunctionComponent<TableProps> = (props) => {
  const { containerClassName, className, columns, data, getRowProps, onRowClick } = props

  if (!data?.length) {
    return null
  }

  const rootClassName = cx(s.container, containerClassName)

  return (
    <div className={rootClassName}>
      <TableInstance
        className={className}
        columns={columns}
        data={data}
        getRowProps={getRowProps}
        onRowClick={onRowClick}
      />
    </div>
  )
}

export default Table
