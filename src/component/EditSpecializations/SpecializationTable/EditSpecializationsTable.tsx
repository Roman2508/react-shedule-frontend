import * as React from 'react'
import '../EditSpecializations.scss'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import createListOfSubjects, { ListSubjectType } from '../../../utils/createListOfSubjects'
import SpecializationTableToolbar from './SpecializationTableToolbar'
import SpecializationTableHead from './SpecializationTableHead'
import {
  GroupLoadItemType,
  SelectedSpecializationSubjectType,
  SpecializationSubjectsType,
} from '../../../redux/group/groupTypes'
import { getComparator, Order, specializationTableSort } from '../../../utils/tableSort'

/* /////////////////////////////////////////////// */

type EditSpecializationsTableType = {
  groupLoad: GroupLoadItemType[]
  specializationsList: { _id: string; name: string }[]
  specializationsSubjects: SpecializationSubjectsType[]
}

const EditSpecializationsTable: React.FC<EditSpecializationsTableType> = ({
  groupLoad,
  specializationsList,
  specializationsSubjects,
}) => {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof ListSubjectType>('lectures')
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(true)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [selectedSubjects, setSelectedSubjects] = React.useState<SelectedSpecializationSubjectType | null>(null)

  const [selectedSpecialization, setSelectedSpecialization] = React.useState('999')

  /* create subject list  */
  const subjectList = createListOfSubjects(groupLoad)
  /* // create subject list  */

  /* create subject list with specializations */
  const createSubjects = () => {
    const newData = subjectList.map((el) => {
      const some = specializationsSubjects.find((s) => s.name === el.name && s.semester === el.semester)
      if (some) {
        return some
      }
      return { ...el, specialization: { name: 'Спеціалізація відсутня', _id: '999' } }
    })
    return newData
  }
  const subjects = createSubjects()
  /* // create subject list with specializations */

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof ListSubjectType) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked)
  }

  const onSelectSubject = (subject: SpecializationSubjectsType) => {
    setSelectedSubjects((prev) => {
      if (prev?.name === subject.name && prev?.semester === subject.semester) {
        return null
      } else {
        setSelectedSpecialization(subject.specialization._id)
        const item = { ...subject, groupId: groupLoad[0].groupId }
        return item
      }
    })
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - subjectList.length) : 0

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        {/*  */}

        <SpecializationTableToolbar
          selectedSpecialization={selectedSpecialization}
          setSelectedSpecialization={setSelectedSpecialization}
          specializationsList={specializationsList}
          specializationsSubjects={specializationsSubjects}
          selectedSubjects={selectedSubjects}
          groupLoad={groupLoad}
        />

        {/*  */}

        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
            {/* Table Head */}
            <SpecializationTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
            {/* // Table Head */}

            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
              {specializationTableSort(subjects, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                // @ts-ignore
                .map((row: SpecializationSubjectsType, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`

                  const isItemSelected: boolean =
                    selectedSubjects?.name === row.name && selectedSubjects?.semester === row.semester

                  return (
                    <TableRow
                      hover
                      onClick={() => onSelectSubject(row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      sx={row.specialization.name === 'Не вивчається' ? { opacity: '.5' } : {}}
                      key={`${row.name}_${row.semester}`}
                      selected={isItemSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        className="edit-specializations__subject-name">
                        {row.name}
                      </TableCell>

                      <TableCell align="center">
                        {row.specialization.name === 'Спеціалізація відсутня' ? (
                          <span style={{ paddingLeft: '15px' }}>{`${row.semester}`}</span>
                        ) : (
                          <span style={{ paddingLeft: '15px' }}>{`${row.specialization.name}(${row.semester})`}</span>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <span style={{ paddingLeft: '15px' }}>{row.lectures}</span>
                      </TableCell>
                      <TableCell align="center">
                        <span style={{ paddingLeft: '15px' }}>{row.practical}</span>
                      </TableCell>
                      <TableCell align="center">
                        <span style={{ paddingLeft: '15px' }}>{row.laboratory}</span>
                      </TableCell>
                      <TableCell align="center">
                        <span style={{ paddingLeft: '15px' }}>{row.seminars}</span>
                      </TableCell>
                      <TableCell align="center">
                        <span style={{ paddingLeft: '15px' }}>{row.exams}</span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="edit-specializations__table-bottom">
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
            sx={{ ml: '5px' }}
          />

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={subjectList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </Paper>
    </Box>
  )
}

export default EditSpecializationsTable
