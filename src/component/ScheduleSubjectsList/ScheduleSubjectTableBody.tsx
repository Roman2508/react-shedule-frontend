import React from 'react'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'

import { LessonsListItemType, SelectedDistributedLoadType } from '../../redux/distributedLoad/distributedLoadTypes'
import { lessonsType, selectedSubjectType } from '../../redux/lessons/lessonsTypes'

type ScheduleSubjectTableBodyPropsType = {
  lessons: lessonsType[]
  selected: selectedSubjectType
  setSelected: (value: any) => void
  selectedDistributedLoad: SelectedDistributedLoadType[] | lessonsType[]
}

const ScheduleSubjectTableBody: React.FC<ScheduleSubjectTableBodyPropsType> = ({
  selectedDistributedLoad,
  selected,
  lessons,
  setSelected,
}) => {
  const setSelectedSubject = (row: LessonsListItemType, groupId: string, subjectId: string) => {
    const data = {
      ...row,
      // name: row.name,
      // groupId: row.groupId,
      // type: row.type,
      // remark: row.remark,
      // teacher: row.teacher,
      // hours: row.hours,
    }

    setSelected({ data, subjectId, groupId, stream: row.stream })
  }

  return (
    <TableBody>
      {/* if you don't need to support IE11, you can replace the `stableSort` call with: 
            {groupLoad.slice().sort(getComparator(order, orderBy)) */}
      {/* {stableSort(groupLoad, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) */}
      {selectedDistributedLoad.length > 0 &&
        selectedDistributedLoad
          .slice()
          // .sort(getComparator(order, orderBy))
          // @ts-ignore
          .map((row: LessonsListItemType, index: number) => {
            const isItemSelected =
              // row._id === selected.subjectId &&
              row.remark === selected.data?.remark &&
              row.type === selected.data?.type &&
              row.name === selected.data?.name &&
              row.groupId === selected.groupId

            const labelId = `enhanced-table-checkbox-${index}`

            const postedLessons = lessons.filter((el) => {
              return el.remark === row.remark && el.name === row.name && el.subjectType === row.type
            })

            const uniquePostedLessons: lessonsType[] = []

            postedLessons.forEach((el: lessonsType) => {
              const some = uniquePostedLessons.find((s) => {
                return s.date === el.date && s.subjectNumber === el.subjectNumber
              })

              if (!some) {
                uniquePostedLessons.push(el)
              }
            })

            const postedHours = uniquePostedLessons.length * 2

            const isDisabled = row.hours <= postedHours

            return (
              <Tooltip title={row.groupName}>
                <TableRow
                  hover
                  onClick={() => setSelectedSubject(row, String(row.groupId), String(row._id))}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row._id + row.type + row.hours + row.subgroupNumber}
                  selected={isItemSelected}
                  className={`schedule-subjects__table-row ${
                    isDisabled ? 'schedule-subjects__table-row--disabled' : ''
                  }`}>
                  <TableCell className="schedule-subjects__table-cell" component="th" id={labelId} scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell className="schedule-subjects__table-cell" align="center" padding="none">
                    {row.subjectType}
                  </TableCell>
                  <TableCell className="schedule-subjects__table-cell" align="center" padding="none">
                    {row.remark}
                  </TableCell>
                  <TableCell className="schedule-subjects__table-cell" align="left" padding="none">
                    {`${row.teacher.lastName} ${row.teacher.firstName[0]}.${row.teacher.middleName[0]}.`}
                  </TableCell>
                  <TableCell className="schedule-subjects__table-cell" align="center" padding="none">
                    {row.hours}
                  </TableCell>
                  <TableCell className="schedule-subjects__table-cell" align="center" padding="none">
                    {postedHours}
                  </TableCell>
                </TableRow>
              </Tooltip>
            )
          })}
    </TableBody>
  )
}

export default ScheduleSubjectTableBody
