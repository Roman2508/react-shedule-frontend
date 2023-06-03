import React from 'react'
import { ListSubjectType } from '../../../utils/createListOfSubjects'
import '../EditSpecializations.scss'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Box from '@mui/material/Box'
import { visuallyHidden } from '@mui/utils'

type Order = 'asc' | 'desc'

interface HeadCell {
  disablePadding: boolean
  id: keyof ListSubjectType
  label: string
  numeric: boolean
}

interface SpecializationTableHeadProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ListSubjectType) => void
  order: Order
  orderBy: string
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
    label: 'Семестер',
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
    label: 'Екзамени',
  },
]

const SpecializationTableHead: React.FC<SpecializationTableHeadProps> = ({ order, orderBy, onRequestSort }) => {
  const createSortHandler = (property: keyof ListSubjectType) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
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
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export default SpecializationTableHead
