import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { StyledClosedButton } from '../../theme'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { ListSubjectType } from '../../utils/createListOfSubjects'
import { UpdateStreamDetailsType } from '../../api/apiTypes'
import { removeStreamDetails, updateStreamDetails } from '../../redux/streams/streamsAsyncActions'
import { useAppDispatch } from '../../redux/store'
import { StreamsDetailsType, StreamsType } from '../../redux/streams/streamsTypes'
import { SubgroupsType } from '../../redux/group/groupTypes'
import createAlertMessage from '../../utils/createAlertMessage'

type StreamsModalModalPropsType = {
  openModal: boolean
  setOpenModal: (value: boolean) => void
  selectedSubjects: ListSubjectType[] | []
  activeStreamId?: string
  streamDetails?: StreamsDetailsType[]
  setActiveStream: (value: StreamsType | null) => void
}

const StreamsModal: React.FC<StreamsModalModalPropsType> = ({
  openModal,
  setOpenModal,
  selectedSubjects,
  activeStreamId,
  streamDetails,
  setActiveStream,
}) => {
  const dispatch = useAppDispatch()

  const [educationForm, setEducationForm] = React.useState([
    { name: 'Лекції', type: 'lectures', semester: '', subjectName: '', isUnited: false, isDisabled: false },
    { name: 'Практичні', type: 'practical', semester: '', subjectName: '', isUnited: false, isDisabled: false },
    { name: 'Лабораторні', type: 'laboratory', semester: '', subjectName: '', isUnited: false, isDisabled: false },
    { name: 'Семінари', type: 'seminars', semester: '', subjectName: '', isUnited: false, isDisabled: false },
    { name: 'Екзамени', type: 'exams', semester: '', subjectName: '', isUnited: false, isDisabled: false },
  ])

  const handleDisabledButton = () => {
    setEducationForm((prev) => {
      return prev.map((el) => {
        let currentSubject
        el.isDisabled = false

        const some = selectedSubjects.some((s) => s.subgroupNumber !== selectedSubjects[0].subgroupNumber)

        if (some) {
          el.isDisabled = true
        }

        for (let i = 0; i < selectedSubjects.length; i++) {
          currentSubject = selectedSubjects[i]

          if (el.type === 'lectures' && currentSubject.lectures <= 0) {
            el.isDisabled = true
          }
          if (el.type === 'practical' && currentSubject.practical <= 0) {
            el.isDisabled = true
          }
          if (el.type === 'laboratory' && currentSubject.laboratory <= 0) {
            el.isDisabled = true
          }
          if (el.type === 'seminars' && currentSubject.seminars <= 0) {
            el.isDisabled = true
          }
          if (el.type === 'exams' && currentSubject.exams <= 0) {
            el.isDisabled = true
          }

          //@ts-ignore
          if (selectedSubjects[0][el.type] !== selectedSubjects[i][el.type]) {
            el.isDisabled = true
          }

          if (currentSubject?.name !== selectedSubjects[0].name) {
            el.isDisabled = true
          }
          if (currentSubject?.semester !== selectedSubjects[0].semester) {
            el.isDisabled = true
          }
        }

        return el
      })
    })
  }

  React.useEffect(() => {
    handleDisabledButton()

    if (selectedSubjects.length) {
      setEducationForm((prev) => {
        const item = selectedSubjects[0].details

        const res = prev.map((el) => {
          el.semester = selectedSubjects[0].semester
          el.subjectName = selectedSubjects[0].name
          //@ts-ignore
          if (el.type === 'lectures') {
            //@ts-ignore
            el.isUnited = item[el.type]
          }
          if (el.type === 'practical') {
            //@ts-ignore
            el.isUnited = item[el.type]
            el.semester = selectedSubjects[0].semester
          }
          if (el.type === 'laboratory') {
            //@ts-ignore
            el.isUnited = item[el.type]
          }
          if (el.type === 'seminars') {
            //@ts-ignore
            el.isUnited = item[el.type]
          }
          if (el.type === 'exams') {
            //@ts-ignore
            el.isUnited = item[el.type]
          }

          return el
        })

        return res
      })
    }
  }, [selectedSubjects])

  const handleChange = (event: any, name: string) => {
    setEducationForm((prev) => {
      const newData = prev.map((el) => {
        if (el.name === name) {
          el.isUnited = !el.isUnited
        }
        return el
      })
      return newData
    })
  }

  const onMergingSubjects = async () => {
    const mergedSubjects = educationForm.filter((el) => el.isUnited === true)
    const removedSubjects = educationForm.filter((el) => el.isUnited === false && el.isDisabled === false)

    if (activeStreamId && removedSubjects.length && streamDetails) {
      Promise.all(
        removedSubjects.map(async (el) => {
          const findedItem = streamDetails.find(
            (sd) => sd.name === el.subjectName && sd.type === el.type && sd.semester === el.semester,
          )
          if (findedItem) {
            const { payload } = await dispatch(removeStreamDetails({ _id: findedItem._id, streamId: activeStreamId }))

            createAlertMessage(
              dispatch,
              payload,
              `Дисципліну видалено з потоку`,
              'Помилка при видаленні дисципліни з потоку :(',
            )

            if (payload) {
              // @ts-ignore
              setActiveStream((prev: StreamsType) => {
                const newDetails = prev.details.filter((el) => el._id !== payload.id)

                return { ...prev, details: newDetails }
              })
            }
          }
        }),
      )
    } // переробити оновлення локального стейта при видаленні дисципліни з потоку

    if (activeStreamId && mergedSubjects.length === 1) {
      const updateStreamDetailsPayload = {
        name: selectedSubjects[0].name,
        semester: selectedSubjects[0].semester,
        type: mergedSubjects[0].type,
        subgroupNumber: selectedSubjects[0].subgroupNumber,
      }

      const { payload } = await dispatch(
        updateStreamDetails({ _id: activeStreamId, data: [updateStreamDetailsPayload] }),
      )

      createAlertMessage(
        dispatch,
        payload,
        `Дисципліну додано до потоку`,
        'Помилка при додаванні дисципліни до потоку :(',
      )

      // @ts-ignore
      setActiveStream((prev: StreamsType) => {
        return { ...prev, details: payload.data }
      })
      /*  */
    }

    if (activeStreamId && mergedSubjects.length > 1) {
      const updateStreamDetailsPayload: UpdateStreamDetailsType[] = []

      mergedSubjects.forEach((el) => {
        updateStreamDetailsPayload.push({
          type: el.type,
          name: selectedSubjects[0].name,
          semester: selectedSubjects[0].semester,
          subgroupNumber: selectedSubjects[0].subgroupNumber,
        })
      })

      const { payload } = await dispatch(
        updateStreamDetails({ _id: activeStreamId, data: [...updateStreamDetailsPayload] }),
      )

      createAlertMessage(
        dispatch,
        payload,
        `Дисципліну додано до потоку`,
        'Помилка при додаванні дисципліни до потоку :(',
      )

      // @ts-ignore
      setActiveStream((prev: StreamsType) => {
        return { ...prev, details: payload.data }
      })
    }
    handleClose()
  }

  const handleClose = () => {
    setOpenModal(false)
  }

  /* Зробити оновлення даних в redux та оновлення локального стейта !!! */
  /* Зробити оновлення даних в redux та оновлення локального стейта !!! */
  /* Зробити оновлення даних в redux та оновлення локального стейта !!! */

  return (
    <Dialog open={openModal} onClose={handleClose}>
      <DialogTitle>Види занять</DialogTitle>
      <DialogContent>
        {educationForm.map((el, index) => (
          <FormGroup key={index}>
            <FormControlLabel
              disabled={el.isDisabled}
              control={<Checkbox checked={el.isUnited} onClick={(e) => handleChange(e, el.name)} />}
              label={el.name}
            />
          </FormGroup>
        ))}
      </DialogContent>
      <DialogActions>
        <StyledClosedButton variant="outlined" onClick={handleClose}>
          Закрити
        </StyledClosedButton>
        <Button variant="contained" onClick={onMergingSubjects} autoFocus>
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default StreamsModal

// const onMergingSubjects = () => {
//   const mergedSubjects = educationForm.filter((el) => el.isUnited === true)
//   const removedSubjects = educationForm.filter((el) => el.isUnited === false && el.isDisabled === false)

//   if (activeStreamId && removedSubjects.length && streamDetails) {
//     removedSubjects.forEach((el) => {
//       const findedItem = streamDetails.find(
//         (sd) => sd.name === el.subjectName && sd.type === el.type && sd.semester === el.semester,
//       )
//       if (findedItem) {
//         const { payload } = await dispatch(removeStreamDetails({ _id: findedItem._id, streamId: activeStreamId }))

//         createAlertMessage(
//           dispatch,
//           payload,
//           'Дисципліну видалено з потоку',
//           'Помилка при видаленні дисципліни з потоку :(',
//         )

//         if (payload) {
//           // @ts-ignore
//           setActiveStream((prev: StreamsType) => {
//             const newDetails = prev.details.filter((el) => el._id !== payload.id)

//             return { ...prev, details: newDetails }
//           })
//         }
//       }
//     })
//   } // переробити оновлення локального стейта при видаленні дисципліни з потоку

//   if (activeStreamId && mergedSubjects.length === 1) {
//     const payload = {
//       name: selectedSubjects[0].name,
//       semester: selectedSubjects[0].semester,
//       type: mergedSubjects[0].type,
//       subgroupNumber: selectedSubjects[0].subgroupNumber,
//     }

//     dispatch(updateStreamDetails({ _id: activeStreamId, data: [payload] })).then(({ payload }) => {
//       // @ts-ignore
//       setActiveStream((prev: StreamsType) => {
//         return { ...prev, details: payload.data }
//       })
//     })
//   } else if (activeStreamId && mergedSubjects.length > 1) {
//     const payload: UpdateStreamDetailsType[] = []

//     mergedSubjects.forEach((el) => {
//       payload.push({
//         name: selectedSubjects[0].name,
//         semester: selectedSubjects[0].semester,
//         type: el.type,
//         subgroupNumber: selectedSubjects[0].subgroupNumber,
//       })
//     })

//     dispatch(updateStreamDetails({ _id: activeStreamId, data: [...payload] })).then(({ payload }) => {
//       // @ts-ignore
//       setActiveStream((prev: StreamsType) => {
//         return { ...prev, details: payload.data }
//       })
//     })
//   }
//   handleClose()
// }
