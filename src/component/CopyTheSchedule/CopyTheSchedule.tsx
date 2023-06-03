import moment from 'moment'
import * as React from 'react'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControlLabel from '@mui/material/FormControlLabel'

import './copyTheSchedule.scss'
import { StyledClosedButton } from '../../theme'
import { copyWeekLessons } from '../../redux/lessons/lessonsAsyncActions'
import createAlertMessage from '../../utils/createAlertMessage'
import { useAppDispatch } from '../../redux/store'

type WeekType = {
  startDate: string
  startUnix: any
  endDate: string
  endUnix: any
}

type CopyTheSchedulePropsType = {
  weeks: any[]
  institutionId: string
  selectedGroupId: string
  openCopyTheScheduleModal: boolean
  setOpenCopyTheScheduleModal: (val: boolean) => void
}

export const CopyTheSchedule: React.FC<CopyTheSchedulePropsType> = ({
  weeks,
  institutionId,
  selectedGroupId,
  openCopyTheScheduleModal,
  setOpenCopyTheScheduleModal,
}) => {
  const dispatch = useAppDispatch()

  const [allWeeksOfSemester, setAllWeeksOfSemester] = React.useState<WeekType[]>([])

  const [copyFrom, setCopyFrom] = React.useState<WeekType>({
    startDate: '',
    startUnix: '',
    endDate: '',
    endUnix: '',
  })

  const [copyTo, setCopyTo] = React.useState<WeekType[]>([])

  const [copyType, setCopyType] = React.useState(0)

  React.useEffect(() => {
    const weeksData = weeks.map((w) => {
      const startUnix = w[0][0].start
      const endUnix = w[w.length - 1][0].start
      const startDate = moment.unix(startUnix).clone().format('DD.MM')
      const endDate = moment.unix(endUnix).clone().format('DD.MM')

      return { startDate, startUnix, endDate, endUnix }
    })

    setAllWeeksOfSemester(weeksData)
  }, [weeks])

  const handleChangeCopyFrom = (week: WeekType) => {
    // @ts-ignore
    setCopyFrom((prev) => {
      if (prev.startDate === week.startDate) {
        return {}
      } else {
        return week
      }
    })

    // setCopyTo((prevValue) => {
    //   const newData = prevValue.filter((el) => {
    //     console.log(el.startDate, copyFrom.startDate)
    //     return el.startDate !== copyFrom.startDate
    //   })
    //   return newData
    // })
  }

  const handleChangeCopyTo = (week: WeekType) => {
    setCopyTo((prev) => {
      const some = prev.some((el) => el.startDate === week.startDate)

      if (some) {
        const newItems = prev.filter((item) => item.startDate !== week.startDate)

        return newItems
      }

      return [...prev, week]
    })
  }

  const handleClose = () => {
    setOpenCopyTheScheduleModal(false)
    setCopyTo([])
  }

  const onCopyWeekLessons = () => {
    handleClose()

    if (globalThis.confirm('Ви дійсно хочете скопіювати розклад?')) {
      Promise.all(
        copyTo.map(async (el) => {
          const data = {
            institutionId,
            groupId: selectedGroupId,
            startDateCopyFrom: Number(copyFrom.startUnix),
            endDateCopyFrom: Number(copyFrom.endUnix),
            startDateCopyTo: Number(el.startUnix),
            endDateCopyTo: Number(el.endUnix),
          }

          const { payload } = await dispatch(copyWeekLessons(data))
          createAlertMessage(
            dispatch,
            payload,
            'Копіювання виконано!',
            'Помилка при копіюванні, можливі накладки занять',
          )
        }),
      )
    }
  }

  const handleCopyTypeChange = (event: React.SyntheticEvent, newValue: number) => {
    setCopyType(newValue)
  }

  return (
    <Dialog onClose={handleClose} open={openCopyTheScheduleModal}>
      <DialogTitle>Копіювання розкладу</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}>
        <CloseIcon />
      </IconButton>
      <DialogContent dividers className="copy-the-schedule__content">
        {/*  */}
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={copyType} onChange={handleCopyTypeChange}>
              <Tab label="Копіювати тиждень" className="copy-the-schedule__tab" />
              <Tab label="Копіювати день" className="copy-the-schedule__tab" disabled />
            </Tabs>
          </Box>
          {copyType === 0 && (
            <div className="copy-the-schedule__tab-panel">
              <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                <FormLabel component="legend">Копіювати з:</FormLabel>
                <FormGroup>
                  {allWeeksOfSemester.map((w: WeekType, index: number) => (
                    <FormControlLabel
                      key={w.startDate}
                      control={
                        <Checkbox
                          checked={copyFrom.startDate === w.startDate}
                          onChange={() => handleChangeCopyFrom(w)}
                          name={w.startDate}
                        />
                      }
                      label={`${index + 1} (${w.startDate} - ${w.endDate})`}
                    />
                  ))}
                </FormGroup>
              </FormControl>
              {/*  */}
              <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                <FormLabel component="legend">Копіювати на:</FormLabel>
                <FormGroup>
                  {allWeeksOfSemester.map((w: WeekType, index: number) => {
                    const isChecked = copyTo.some((el) => el.startDate === w.startDate)

                    return (
                      <FormControlLabel
                        key={w.startDate}
                        control={
                          <Checkbox
                            checked={isChecked}
                            disabled={copyFrom.startDate === w.startDate}
                            onChange={() => handleChangeCopyTo(w)}
                            name={w.startDate}
                          />
                        }
                        label={`${index + 1} (${w.startDate} - ${w.endDate})`}
                      />
                    )
                  })}
                </FormGroup>
              </FormControl>
            </div>
          )}
          {copyType === 1 && (
            <div className="copy-the-schedule__tab-panel" style={{ height: '449px', width: '476px' }}>
              <p>2</p>
            </div>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <StyledClosedButton autoFocus onClick={handleClose}>
          Закрити
        </StyledClosedButton>
        <Button autoFocus onClick={onCopyWeekLessons} disabled={!copyFrom.startDate || !copyTo.length}>
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  )
}
