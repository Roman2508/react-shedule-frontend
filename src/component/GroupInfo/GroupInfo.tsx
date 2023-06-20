import * as React from 'react'
import moment from 'moment'
import * as yup from 'yup'
import { Link } from 'react-router-dom'
import Paper from '@mui/material/Paper'
import Slide from '@mui/material/Slide'
import { Box, Stack } from '@mui/system'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import { ukUA } from '@mui/x-date-pickers'
import Toolbar from '@mui/material/Toolbar'
import TextField from '@mui/material/TextField'
import { AlertColor } from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import { yupResolver } from '@hookform/resolvers/yup'
import { TransitionProps } from '@mui/material/transitions'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

import './GroupInfo.scss'
import AlertMessage from '../AlertMessage'
import { useAppDispatch } from '../../redux/store'
import { GroupInfoTypes } from '../../api/apiTypes'
import CircularPreloader from '../CircularPreloader'
import EditSubgroups from '../EditSubgroups/EditSubgroups'
import SelectEducationalPlan from '../SelectEducationalPlan'
import { setShowError } from '../../redux/alerts/alertsSlise'
import { selectGroups } from '../../redux/group/groupSelector'
import createAlertMessage from '../../utils/createAlertMessage'
import { removeSelectedGroup } from '../../redux/group/groupSlise'
import { selectAuthData } from '../../redux/accountInfo/accountInfoSelector'
import EditSpecializations from '../EditSpecializations/EditSpecializations'
import { fetchEducationalPlans } from '../../redux/educationalPlan/educationalPlanAsyncAction'
import { selectEducationalPlans } from '../../redux/educationalPlan/educationalPlanSelector'
import { StyledAppBar, StyledClosedButton, StyledGrayButton, StyledGroupAdmissionDatePicker } from '../../theme'
import { createGroup, getGroupById, updateGroupInfo, updateGroupLoad } from '../../redux/group/groupAsyncAction'
import { EducationalPlanGroupsType, EducationalPlanType } from '../../redux/educationalPlan/educationalPlanTypes'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

type AlertInfoType = {
  show: boolean
  message: string
  title: string
  severity: AlertColor
}

const groupInfoSchema = yup
  .object()
  .shape({
    name: yup
      .string()
      .min(2, 'Мінімальна довжина шифру групи 2 символа')
      .max(20, 'Максимальна довжина шифру групи 20 символів')
      .required('Вкажіть шифр групи'),
    yearOfAdmission: yup.string().required('Виберіть рік вступу'),
    courseNumber: yup
      .number()
      .min(1, 'Номер курсу може бути від 1 до 6')
      .max(6, 'Номер курсу може бути від 1 до 6')
      .required('Виберіть курс'),
    students: yup
      .number()
      .min(1, 'В групі не може бути менше 1 студента')
      .max(99, 'Кількість студентів в групі не може бути більше 99')
      .required('Вкажіть кількість студентів'),
    formOfEducations: yup.string().required('Виберіть форму навчання'),
    EducationPlanId: yup.string().required('Виберіть навчальний план'),
  })
  .required()

type GroupInfoPropsType = {
  open: boolean
  setOpen: (value: boolean) => void
  specialtyId?: string
  selectedPlanName: string
  setSelectedPlanName: (value: string) => void
  selectedGroupId: string | null
  setSelectedGroupId: (value: string | null) => void
  institutionId: string
  isNewGroup: boolean
}

const GroupInfo: React.FC<GroupInfoPropsType> = ({
  open,
  setOpen,
  specialtyId,
  selectedGroupId,
  setSelectedGroupId,
  selectedPlanName,
  setSelectedPlanName,
  institutionId,
  isNewGroup,
}) => {
  const dispatch = useAppDispatch()

  const [openEducationPlanModal, setOpenEducationPlanModal] = React.useState(false)
  const [openSpecializations, setOpenSpecializations] = React.useState(false)
  const [openEditSubgroups, setOpenEditSubgroups] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(groupInfoSchema),
  })

  const [alertInfo, setAlertInfo] = React.useState<AlertInfoType>({
    show: false,
    message: '',
    title: '',
    severity: 'error',
  })

  const setShowAlert = (val: boolean) => {
    setAlertInfo((prev) => {
      return { ...prev, show: val }
    })
  }

  const [groupInfoValues, setGroupInfoValues] = React.useState<GroupInfoTypes>({
    name: '',
    specialtyId: '',
    yearOfAdmission: '2018',
    courseNumber: '',
    students: '',
    formOfEducations: '',
    EducationPlanId: '',
  })

  const { plans } = useSelector(selectEducationalPlans)
  const { selectedGroup } = useSelector(selectGroups)
  const { institution } = useSelector(selectAuthData)

  React.useEffect(() => {
    if (institution) {
      dispatch(fetchEducationalPlans(institution._id))
    }
  }, [institution])

  React.useEffect(() => {
    if (selectedGroupId) {
      dispatch(getGroupById(selectedGroupId))
    }
  }, [selectedGroupId])

  React.useEffect(() => {
    if (selectedGroup) {
      setGroupInfoValues((prev) => {
        return {
          ...prev,
          ...selectedGroup,
          courseNumber: String(selectedGroup.courseNumber),
          students: String(selectedGroup.students),
          EducationPlanId: selectedGroup.EducationPlanId,
        }
      })

      const plansArray = plans?.map((el: EducationalPlanGroupsType) => el.plans)
      // @ts-ignore
      const allPlans = [].concat.apply([], plansArray)
      const planObj = allPlans.find(
        (el: EducationalPlanType) => String(el._id) === String(selectedGroup.EducationPlanId)
      )
      if (planObj) {
        // @ts-ignore
        setSelectedPlanName(planObj.name)
      }
      /*  */
    }
  }, [selectedGroup])

  const handleClose = () => {
    setOpen(false)
    onClearInputsValue()
    setSelectedGroupId(null)

    dispatch(removeSelectedGroup())
    // setSelectedGroup()
  }

  const onChangeGroupInfo = (type: string, value: string) => {
    if (type === 'yearOfAdmission') {
      const year = moment(value).format('YYYY')

      setGroupInfoValues((prev) => {
        return { ...prev, [type]: year }
      })
      //
    } else {
      setGroupInfoValues((prev) => {
        return { ...prev, [type]: value }
      })
    }
  }

  const onClearInputsValue = () => {
    setGroupInfoValues({
      name: '',
      yearOfAdmission: '',
      courseNumber: '',
      students: '',
      formOfEducations: '',
      EducationPlanId: '',
      specialtyId: '',
    })
  }

  // Show error window
  React.useEffect(() => {
    const keys = Object.keys(errors)

    if (keys.length) {
      // @ts-ignore
      setAlertInfo((prev) => {
        const alertMessage = errors[keys[0]]?.message
        return {
          ...prev,
          show: true,
          message: alertMessage,
          title: 'Помилка',
          severity: 'error',
        }
      })
    }
  }, [errors])

  const onCreateGroup = handleSubmit(async () => {
    if (specialtyId) {
      const createGroupPayload = {
        ...groupInfoValues,
        courseNumber: groupInfoValues.courseNumber,
        students: groupInfoValues.students,
        institutionId,
        specialtyId,
      }
      const { payload } = await dispatch(createGroup(createGroupPayload))
      createAlertMessage(dispatch, payload, 'Групу Додано', 'Помилка при створенні групи :(')
      handleClose()
      onClearInputsValue()
    }
  })

  const onUpdateGroup = handleSubmit(async () => {
    if (window.confirm('Ви дійсно хочете оновити групу?')) {
      if (selectedGroup) {
        const payload = { ...selectedGroup, ...groupInfoValues }

        const { EducationPlanId, ...rest } = payload

        if (selectedGroup.EducationPlanId !== groupInfoValues.EducationPlanId) {
          const plansArray = plans?.map((el) => el.plans)

          if (plansArray) {
            // @ts-ignore
            const allPlans = [].concat.apply([], plansArray)
            // @ts-ignore
            const load = allPlans.find(
              (el: EducationalPlanType) => String(el._id) === String(groupInfoValues.EducationPlanId)
            ).subjects

            if (load && selectedGroupId) {
              const loadData = {
                groupId: selectedGroupId,
                planId: groupInfoValues.EducationPlanId,
                load,
              }

              const { payload } = await dispatch(updateGroupInfo(rest))
              dispatch(updateGroupLoad(loadData))
              createAlertMessage(dispatch, payload, 'Групу оновлено', 'Помилка при оновленні групи :(')
            }
          }
        } else {
          const { payload } = await dispatch(updateGroupInfo(rest))
          createAlertMessage(dispatch, payload, 'Групу оновлено', 'Помилка при оновленні групи :(')
        }
        handleClose()
        onClearInputsValue()
      }
    }
  }) // ???????

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {groupInfoValues.name ? groupInfoValues.name : 'Нова група'}
          </Typography>
          {/* <Button autoFocus color="inherit" onClick={onCreateGroup} disabled>
            Зберегти
          </Button> */}
        </Toolbar>
      </AppBar>
      {!selectedGroup && selectedGroupId ? (
        <CircularPreloader />
      ) : (
        <>
          {/* ALERT MESSAGE */}
          <AlertMessage
            show={alertInfo.show}
            setShow={setShowAlert}
            setShowError={setShowError}
            alertMessage={alertInfo.message}
            alertTitle={alertInfo.title}
            severity={alertInfo.severity}
          />
          {/* // ALERT MESSAGE */}

          <SelectEducationalPlan
            open={openEducationPlanModal}
            setOpen={setOpenEducationPlanModal}
            plans={plans}
            groupInfoValues={groupInfoValues}
            onChangeGroupInfo={onChangeGroupInfo}
            setSelectedPlanName={setSelectedPlanName}
          />

          <EditSpecializations
            openSpecializations={openSpecializations}
            setOpenSpecializations={setOpenSpecializations}
            selectedGroup={selectedGroup}
          />

          <EditSubgroups
            openEditSubgroups={openEditSubgroups}
            setOpenEditSubgroups={setOpenEditSubgroups}
            selectedGroup={selectedGroup}
          />

          <Paper className="group-item" sx={{ padding: '0 0 20px 0 !important' }}>
            <StyledAppBar sx={{ position: 'relative' }}>
              <Toolbar>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                  Інформація про групу
                </Typography>
              </Toolbar>
            </StyledAppBar>

            <Box component="form" className="group-item__form" onSubmit={selectedGroup ? onUpdateGroup : onCreateGroup}>
              {/*  */}
              <TextField
                {...register('name')}
                error={!!errors.name}
                value={groupInfoValues.name}
                onChange={(e) => onChangeGroupInfo('name', e.target.value)}
                className="group-item__input"
                id="outlined-basic"
                label="Шифр групи"
                variant="standard"
                required
              />

              <div
                // variant="outlined"
                className={`group-item__input-plan ${!!errors.EducationPlanId ? 'group-item__input--error' : ''}`}
              >
                <input
                  readOnly
                  onClick={() => setOpenEducationPlanModal(true)}
                  value={selectedPlanName ? `НАВЧАЛЬНИЙ ПЛАН: ${selectedPlanName}` : ''}
                  placeholder="НАВЧАЛЬНИЙ ПЛАН:"
                  className="group-item__input-inner"
                  {...register('EducationPlanId')}
                />
              </div>

              <LocalizationProvider
                dateAdapter={AdapterMoment}
                localeText={ukUA.components.MuiLocalizationProvider.defaultProps.localeText}
                adapterLocale="de"
              >
                <StyledGroupAdmissionDatePicker
                  format="YYYY"
                  views={['year']}
                  label={'Рік вступу'}
                  {...register('yearOfAdmission')}
                  minDate={moment('2018', 'YYYY')}
                  maxDate={moment('2041', 'YYYY')}
                  onChange={(e: any) => onChangeGroupInfo('yearOfAdmission', e)}
                  value={
                    groupInfoValues.yearOfAdmission
                      ? moment(groupInfoValues.yearOfAdmission, 'YYYY')
                      : moment('2018', 'YYYY')
                  }
                  className={`group-item__date-picker ${
                    !!errors.yearOfAdmission ? 'group-item__date-picker--error' : ''
                  }`}
                />
              </LocalizationProvider>

              <Link to="/streams" className="group-item__input">
                <StyledGrayButton variant="outlined" sx={{ minWidth: '100%' }} disabled={!selectedGroup}>
                  Потоки
                </StyledGrayButton>
              </Link>
              {/*  */}

              <TextField
                {...register('courseNumber')}
                error={!!errors.courseNumber}
                value={groupInfoValues.courseNumber}
                inputProps={{ min: 1, max: 6 }}
                onChange={(e) => onChangeGroupInfo('courseNumber', e.target.value)}
                className="group-item__input"
                variant="standard"
                type="number"
                label="Курс"
                required
              />
              <StyledGrayButton
                variant="outlined"
                className="group-item__input"
                onClick={() => setOpenEditSubgroups(true)}
                disabled={!selectedGroup}
              >
                Підгрупи
              </StyledGrayButton>

              {/*  */}

              <TextField
                {...register('students')}
                error={!!errors.students}
                value={groupInfoValues.students}
                onChange={(e) => onChangeGroupInfo('students', e.target.value)}
                inputProps={{ min: 1, max: 99 }}
                className="group-item__input"
                label="Кількість студентів"
                variant="standard"
                type="number"
                required
              />

              <StyledGrayButton
                variant="outlined"
                className="group-item__input"
                onClick={() => setOpenSpecializations(true)}
                disabled={!selectedGroup}
              >
                Спеціалізовані підгрупи
              </StyledGrayButton>

              {/*  */}

              <FormControl className="group-item__input" variant="standard">
                <InputLabel id="demo-simple-select-label">Форма навчання</InputLabel>
                <Select
                  label="educationForm"
                  {...register('formOfEducations')}
                  error={!!errors.formOfEducations}
                  value={groupInfoValues.formOfEducations}
                  onChange={(e) => onChangeGroupInfo('formOfEducations', e.target.value)}
                >
                  <MenuItem value={'Денна'}>Денна</MenuItem>
                  <MenuItem value={'Заочна'}>Заочна</MenuItem>
                </Select>
              </FormControl>
              <button type="submit"></button>
            </Box>
          </Paper>

          <Box className="group-item__bottom">
            <Button variant="outlined" disabled={true || !selectedGroup}>
              Переглянути навантаження
            </Button>

            <Stack spacing={2} direction="row">
              <Button variant="contained" onClick={selectedGroup ? onUpdateGroup : onCreateGroup}>
                Зберегти
              </Button>
              <StyledClosedButton variant="outlined" onClick={handleClose}>
                Закрити
              </StyledClosedButton>
            </Stack>
          </Box>
        </>
      )}
    </Dialog>
  )
}

export default GroupInfo
