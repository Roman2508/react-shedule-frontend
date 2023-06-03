import * as React from 'react'
import '../EditSubgroups.scss'
import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Checkbox from '@mui/material/Checkbox'
import { visuallyHidden } from '@mui/utils'
import { StyledTableCell } from '../../../theme'

interface Data {
  name: string
  semester: number
  lectures: number
  practical: number
  laboratory: number
  seminars: number
  exams: number
}

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  numeric: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Назва дисципліни',
  },
  {
    id: 'semester',
    numeric: true,
    disablePadding: false,
    label: 'Семестр',
  },
  {
    id: 'lectures',
    numeric: true,
    disablePadding: false,
    label: 'Лекції',
  },
  {
    id: 'practical',
    numeric: true,
    disablePadding: false,
    label: 'Практичні',
  },
  {
    id: 'laboratory',
    numeric: true,
    disablePadding: false,
    label: 'Лабораторні',
  },
  {
    id: 'seminars',
    numeric: true,
    disablePadding: false,
    label: 'Семінари',
  },
  {
    id: 'exams',
    numeric: true,
    disablePadding: false,
    label: 'Екзамен',
  },
]

type Order = 'asc' | 'desc'

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void
  order: Order
  orderBy: string
  rowCount: number
}

////////////////////////////////////////////////////
function SubgroupsTableHead(props: EnhancedTableProps) {
  const { order, orderBy, numSelected, rowCount, onRequestSort } = props
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export default SubgroupsTableHead
