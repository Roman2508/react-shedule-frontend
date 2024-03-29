import * as React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import './EducationalPlanEdit.scss'
import { StyledClosedButton } from '../../theme'
import { SubjectType } from '../../redux/educationalPlan/educationalPlanTypes'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from '../../redux/store'
import { fetchChangeSubjectHours, removeSubjectSemester } from '../../redux/educationalPlan/educationalPlanAsyncAction'
import createAlertMessage from '../../utils/createAlertMessage'

type EducationalPlanEditPropsType = {
  selectedSubject: { id: number; name: string; hours: SubjectType; semester: string } | null
  openEducationalPlanModal: boolean
  setOpenEducationalPlanModal: (value: boolean) => void
}

const disciplinesFormInitialState = [
  {
    id: 'lectures',
    hours: 0,
    maxLength: 3,
  },
  {
    id: 'practical',
    hours: 0,
    maxLength: 3,
  },
  {
    id: 'laboratory',
    hours: 0,
    maxLength: 3,
  },
  {
    id: 'seminars',
    hours: 0,
    maxLength: 3,
  },
  {
    id: 'zalik',
    hours: 0,
    maxLength: 3,
  },
  {
    id: 'exams',
    hours: 0,
    maxLength: 3,
  },
]

const inputNames = [
  'Лекції',
  'Практичні',
  'Лабораторні',
  'Семінари',
  'Заліки',
  'Екзамени',
  'Курсова робота',
  'Самостійна робота',
  'Загальна кількість годин',
]

// const EducationalPlanModalSchema = yup.object({
//   lectures: yup.number(),
//   practical: yup.number(),
//   laboratory: yup.number(),
//   seminars: yup.number(),
//   exams: yup.number(),
//   termPaper: yup.boolean(),
//   individual: yup.number(),
//   inPlan: yup.number(),
//   inFact: yup.number(),
// })

const EducationalPlanEdit: React.FC<EducationalPlanEditPropsType> = ({
  selectedSubject,
  openEducationalPlanModal,
  setOpenEducationalPlanModal,
}) => {
  const isSubject = selectedSubject?.hours !== null

  const dispatch = useAppDispatch()

  const [inPlan, setinPlan] = React.useState(0)
  const [isTermPaper, setTermPaper] = React.useState<boolean>()
  const [individualWork, setIndividualWork] = React.useState(0)
  const [disciplinesForm, setDisciplinesForm] = React.useState(disciplinesFormInitialState)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const selectedHours = disciplinesForm
    .map((el) => {
      if (el.id === 'lectures' || el.id === 'practical' || el.id === 'laboratory' || el.id === 'seminars') {
        return el.hours
      }
    })
    .filter((el) => el !== undefined)
    .reduce((sum, el) => {
      if (el !== undefined && sum !== undefined) {
        return el + sum
      }
    }, 0)

  const totalHours = (selectedHours || 0) + individualWork

  React.useEffect(() => {
    setTermPaper(isSubject ? selectedSubject?.hours.termPaper : false)
    if (selectedSubject !== null && selectedSubject.hours !== null) {
      setDisciplinesForm((prevValues) => {
        return prevValues.map((prev) => {
          const keys = Object.keys(selectedSubject.hours)
          const values = Object.values(selectedSubject.hours)
          const returnedValues = keys
            .map((key) => {
              if (key === prev.id) {
                const index = keys.indexOf(key)
                return values[index]
              }
            })
            .filter((value) => value !== undefined)
          return {
            id: prev.id,
            hours: returnedValues[0],
            maxLength: prev.maxLength,
          }
        })
      })

      if (selectedSubject?.hours) {
        if (selectedSubject?.hours.inPlan) {
          setinPlan(selectedSubject?.hours.inPlan)
        }

        if (selectedSubject?.hours.individual) {
          setIndividualWork(selectedSubject.hours.individual)
        }
      }
    }

    return () => {
      setinPlan(0)
      setIndividualWork(0)
    }
  }, [selectedSubject])

  const onClearInputsValue = () => {
    setDisciplinesForm((prev) => {
      return prev.map((el) => {
        return { ...el, hours: 0 }
      })
    })
    setIndividualWork(0)
    setinPlan(0)
  }

  const onCreateNewSemester = async () => {
    if (selectedSubject !== null) {
      const changeSubjectHoursPayload: SubjectType = {
        lectures: disciplinesForm.find((el) => el.id === 'lectures')?.hours || 0,
        practical: disciplinesForm.find((el) => el.id === 'practical')?.hours || 0,
        laboratory: disciplinesForm.find((el) => el.id === 'laboratory')?.hours || 0,
        seminars: disciplinesForm.find((el) => el.id === 'seminars')?.hours || 0,
        zalik: disciplinesForm.find((el) => el.id === 'zalik')?.hours || 0,
        exams: disciplinesForm.find((el) => el.id === 'exams')?.hours || 0,
        inPlan: inPlan || 0,
        individual: individualWork || 0,
        termPaper: isTermPaper || false,
      }

      const { payload } = await dispatch(
        fetchChangeSubjectHours({
          id: selectedSubject.id,
          payload: changeSubjectHoursPayload,
          semester: selectedSubject.semester,
        })
      )

      createAlertMessage(dispatch, payload, 'Семестр додано', 'Помилка при додаванні семестру :(')

      onClearInputsValue()
      handleClose()
    }
  }

  const onChangeFieldValue = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, id: string) => {
    setDisciplinesForm((prev) => {
      return prev.map((el) => {
        if (el.id === id) {
          return {
            id: el.id,
            hours: Number(e.target.value),
            maxLength: el.maxLength,
          }
        }
        return el
      })
    })
  }

  const handleClose = () => {
    setOpenEducationalPlanModal(false)
    onClearInputsValue()
  }

  const onRemoveSubjectSemester = async () => {
    if (selectedSubject !== null) {
      if (window.confirm('Ви дійсно хочете видалити семестр?')) {
        const { payload } = await dispatch(
          removeSubjectSemester({
            id: selectedSubject.id,
            payload: selectedSubject.semester,
          })
        )

        createAlertMessage(dispatch, payload, 'Cеместр видалено', 'Помилка при видаленні семестру :(')

        handleClose()
      }
    }
  }

  return (
    <Dialog open={openEducationalPlanModal} onClose={handleClose}>
      <div className="educational-plan-edit__wrapper">
        <div className="educational-plan-edit__top">
          <DialogTitle className="educational-plan-edit__title">
            {selectedSubject?.name || 'Навчальна дисципліна'}
          </DialogTitle>
          <Typography sx={totalHours !== inPlan || totalHours <= 0 || inPlan <= 0 ? { color: 'red' } : {}}>
            {`${totalHours} / ${inPlan}`}
          </Typography>
        </div>
        <DialogContent className="educational-plan-edit__box">
          <div className="educational-plan-edit__input-names">
            {inputNames.map((el) => (
              <Typography key={el}>{el}</Typography>
            ))}
          </div>
          <form className="educational-plan-edit__form-box" onSubmit={handleSubmit(onCreateNewSemester)}>
            {disciplinesForm.map((el) => (
              <TextField
                size="small"
                className="educational-plan-edit__input"
                key={el.id}
                margin="dense"
                variant="outlined"
                type="number"
                inputProps={{ maxLength: 3 }}
                value={el.hours > 0 ? el.hours : ''}
                {...register(el.id, { maxLength: el.maxLength })}
                onChange={(e) => onChangeFieldValue(e, el.id)}
              />
            ))}
            <Checkbox
              {...register('termPaper')}
              sx={{ mr: 'auto', mt: '6px' }}
              checked={isTermPaper}
              onClick={() => setTermPaper(!isTermPaper)}
            />
            {/* individual */}
            <div className="educational-plan-edit__input-box">
              <TextField
                size="small"
                className="educational-plan-edit__input"
                margin="dense"
                id="name"
                variant="outlined"
                type="number"
                inputProps={{ maxLength: 3 }}
                {...register('individual', { maxLength: 3 })}
                value={individualWork || ''}
                onChange={(e) => setIndividualWork(Number(e.target.value))}
              />
            </div>
            {/* inPlan */}
            <div className="educational-plan-edit__input-box">
              <TextField
                size="small"
                className="educational-plan-edit__input"
                margin="dense"
                id="name"
                variant="outlined"
                type="number"
                inputProps={{ maxLength: 3 }}
                value={inPlan || ''}
                {...register('inPlan', { maxLength: 3 })}
                onChange={(e) => setinPlan(Number(e.target.value))}
              />
            </div>
            <DialogActions sx={{ mt: '20px' }}>
              <StyledClosedButton onClick={handleClose}>Закрити</StyledClosedButton>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  totalHours !== inPlan || totalHours <= 0 || inPlan <= 0 || isSubmitting /* || !selectedDepartmentId */
                }
              >
                Зберегти
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
        <Button
          className="educational-plan-edit__remove-btn"
          onClick={onRemoveSubjectSemester}
          variant="outlined"
          color="error"
        >
          Видалити
        </Button>
      </div>
    </Dialog>
  )
}

export default EducationalPlanEdit
