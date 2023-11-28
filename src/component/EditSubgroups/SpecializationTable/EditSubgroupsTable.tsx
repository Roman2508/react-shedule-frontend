import * as React from 'react'
import '../EditSubgroups.scss'
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
import EditSubgroupsModal from '../EditSubgroupsModal'
import SubgroupsTableHead from './SubgroupsTableHead'
import SubgroupsTableToolbar from './SubgroupsTableToolbar'
import { tableSort, getComparator, Order } from '../../../utils/tableSort'
import { GroupLoadItemType, SubgroupsSubjectsType, SubgroupsType } from '../../../redux/group/groupTypes'
import createListOfSubjects from '../../../utils/createListOfSubjects'
import { StreamsType } from '../../../redux/streams/streamsTypes'

interface Data {
  name: string
  semester: number
  lectures: number
  practical: number
  laboratory: number
  seminars: number
  exams: number
}

type EditSubgroupsPropsType = {
  groupLoad: GroupLoadItemType[]
  subgroups: SubgroupsType[]
  groupId: string
  streams: StreamsType[]
}

const EditSubgroupsTable: React.FC<EditSubgroupsPropsType> = ({ groupLoad, subgroups, groupId, streams }) => {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('lectures')
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(true)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const [selectedItems, setSelectedItems] = React.useState<SubgroupsSubjectsType[] | []>([])

  const [openSubgroupsModal, setOpenSubgroupsModal] = React.useState(false)

  const subjectList = createListOfSubjects(groupLoad)

  const createSubjects = () => {
    const newData = subjectList.map((el) => {
      const some = subgroups.find((s) => s.name === el.name && s.semester === el.semester)
      if (some) {
        return {
          ...el,
          subgroups: some,
        }
      } else {
        return {
          ...el,
          subgroups: {
            _id: el._id,
            groupId: groupId,
            name: el.name,
            semester: el.semester,
            lectures: null,
            practical: null,
            laboratory: null,
            seminars: null,
            exams: null,
          },
        }
      }
    })
    return newData
  }

  const subjects = createSubjects()

  const handleSelectedItems = (subject: SubgroupsSubjectsType) => {
    setSelectedItems((prev) => {
      const findedSubject = prev.find((el) => el._id === subject._id)

      if (findedSubject) {
        const subjects = prev.filter((el) => el._id !== subject._id)

        return subjects
      } else {
        return [...prev, subject]
      }
    })
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - subjectList.length) : 0

  return (
    <>
      <EditSubgroupsModal
        openSubgroupsModal={openSubgroupsModal}
        setOpenSubgroupsModal={setOpenSubgroupsModal}
        selectedItems={selectedItems}
        subgroups={subgroups}
        setSelectedItems={setSelectedItems}
        streams={streams}
      />

      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          {/* ToolBar */}

          <SubgroupsTableToolbar numSelected={selectedItems.length} setOpenSubgroupsModal={setOpenSubgroupsModal} />

          {/* // ToolBar */}

          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
              {/* table head */}

              <SubgroupsTableHead
                numSelected={selectedItems.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={selectedItems.length}
              />

              {/* // table head */}

              <TableBody>
                {/* if you don't need to support IE11, you can replace the `tableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
                {tableSort(subjects, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = selectedItems.some((el) => el._id === row._id)

                    const labelId = `enhanced-table-checkbox-${index}`

                    return (
                      <TableRow
                        hover
                        onClick={() => handleSelectedItems(row)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row._id}
                        selected={isItemSelected}
                      >
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
                          className="edit-subgroups__subject-name"
                        >
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.semester}</TableCell>
                        <TableCell align="right">{` ${row.subgroups.lectures ? `(п. ${row.subgroups.lectures})` : ''} ${
                          row.lectures <= 0 ? 0 : row.lectures
                        }`}</TableCell>

                        <TableCell align="right">{` ${
                          row.subgroups.practical ? `(п. ${row.subgroups.practical})` : ''
                        } ${row.practical <= 0 ? 0 : row.practical}`}</TableCell>

                        <TableCell align="right">{` ${
                          row.subgroups.laboratory ? `(п. ${row.subgroups.laboratory})` : ''
                        } ${row.laboratory}`}</TableCell>

                        <TableCell align="right">{` ${row.subgroups.seminars ? `(п. ${row.subgroups.seminars})` : ''} ${
                          row.seminars <= 0 ? 0 : row.seminars
                        }`}</TableCell>

                        <TableCell align="right">{` ${row.subgroups.exams ? `(п. ${row.subgroups.exams})` : ''} ${
                          row.exams <= 0 ? 0 : row.exams
                        }`}</TableCell>
                      </TableRow>
                    )
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="edit-subgroups__table-bottom">
            <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />
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
    </>
  )
}

export default EditSubgroupsTable
