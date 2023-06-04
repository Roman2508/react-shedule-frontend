import React from 'react'
import TableRow from '@mui/material/TableRow'
import { StyledTableForDistributedLoad } from '../../../theme'
import { DistributedLoadSubjectsType } from '../../../redux/distributedLoad/distributedLoadTypes'

const LoadDistributionTotalRow: React.FC<{ distributedLoad: DistributedLoadSubjectsType[] }> = ({
  distributedLoad,
}) => {
  const calculateTotalHours = (distributedLoad: DistributedLoadSubjectsType[]) => {
    const res = [
      { type: 'Лекції', hours: 0 },
      { type: 'Практичні', hours: 0 },
      { type: 'Лабораторні', hours: 0 },
      { type: 'Семінари', hours: 0 },
      { type: 'Екзамени', hours: 0 },
    ]

    distributedLoad.forEach((el) => {
      const allKeys = Object.keys(el)

      const subjectsKeys = allKeys.filter(
        (k) =>
          k.includes('lectures') ||
          k.includes('practical') ||
          k.includes('laboratory') ||
          k.includes('seminars') ||
          k.includes('exams'),
      )

      const calculate = (k: string, type: string) => {
        // @ts-ignore
        if (el[k].type === type) {
          // @ts-ignore
          const findedItem = res.find((i) => i.type === el[k].type)

          if (!findedItem) return

          // @ts-ignore
          findedItem.hours = findedItem.hours + el[k].hours
        }
      }

      subjectsKeys.forEach((k) => {
        calculate(k, 'Лекції')
        calculate(k, 'Практичні')
        calculate(k, 'Лабораторні')
        calculate(k, 'Семінари')
        calculate(k, 'Екзамени')
      })
    })

    return res
  }

  const totalHours = calculateTotalHours(distributedLoad)

  return (
    <TableRow hover role="checkbox" tabIndex={-1}>
      {/*  */}
      <StyledTableForDistributedLoad component="th" scope="row">
        Всього:
      </StyledTableForDistributedLoad>
      <StyledTableForDistributedLoad align="center">-</StyledTableForDistributedLoad>

      {totalHours.map((el) => (
        <React.Fragment key={el.type}>
          <StyledTableForDistributedLoad align="center">{el.hours}</StyledTableForDistributedLoad>
          <StyledTableForDistributedLoad align="center">-</StyledTableForDistributedLoad>
        </React.Fragment>
      ))}
    </TableRow>
  )
}

export default LoadDistributionTotalRow
