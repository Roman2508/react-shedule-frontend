import React from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import FilterIcon from '@mui/icons-material/TuneOutlined'
import ClearIcon from '@mui/icons-material/CancelOutlined'
import CircularProgress from '@mui/material/CircularProgress'
import AddIcon from '@mui/icons-material/ArrowCircleLeftOutlined'
import ConfirmIcon from '@mui/icons-material/CheckOutlined'
import ClearAllIcon from '@mui/icons-material/CleaningServicesOutlined'
import AddAllIcon from '@mui/icons-material/KeyboardDoubleArrowLeftOutlined'

import './LoadDistribution.scss'
import reactLogo from '../../assets/table.svg'
import { useAppDispatch } from '../../redux/store'
import { AttachTeacherType } from '../../api/apiTypes'
import { selectAlerts } from '../../redux/appSelectors'
import AlertMessage from '../../component/AlertMessage'
import { setShowError } from '../../redux/alerts/alertsSlise'
import { getGroups } from '../../redux/group/groupAsyncAction'
import createAlertMessage from '../../utils/createAlertMessage'
import TheachersList from '../../component/TeachersList/TeachersList'
import { selectFaculties } from '../../redux/faculties/facultiesSelectors'
import { selectAuthData } from '../../redux/accountInfo/accountInfoSelector'
import { getAllFaculties } from '../../redux/faculties/facultiesAsyncAction'
import { attachTeacher, updateStudentsCount } from '../../redux/distributedLoad/distributedLoadAsyncAction'
import { clearDistributedLoad } from '../../redux/distributedLoad/distributedLoadSlise'
import { TeacherType } from '../../redux/teachersAndDepartment/teachersAndDepartmentTypes'
import { selectDistributedLoad } from '../../redux/distributedLoad/distributedLoadSelector'
import LoadDistributionTable from '../../component/LoadDistributionTable/LoadDistributionTable'
import { getAllDepartments } from '../../redux/teachersAndDepartment/teachersAndDepartmentAsyncAction'
import { selectTeachersAndDepartments } from '../../redux/teachersAndDepartment/teachersAndDepartmentSelector'
import LoadDistributionGroupFilter from '../../component/LoadDistributionGroupFilter/LoadDistributionGroupFilter'
import { DistributedLoadSubjectsType, DistributedSubjectsType } from '../../redux/distributedLoad/distributedLoadTypes'

type StudentsCountPropsType = {
  subjectType: string
  students: string
}

const LoadDistribution = () => {
  const dispatch = useAppDispatch()

  const alertInfo = useSelector(selectAlerts)
  const { faculties } = useSelector(selectFaculties)
  const { institution } = useSelector(selectAuthData)
  const { departments } = useSelector(selectTeachersAndDepartments)

  const { load: distributedLoad, loadingStatus } = useSelector(selectDistributedLoad)

  const [selected, setSelected] = React.useState<DistributedLoadSubjectsType | null>(null)
  const [selectedTeacher, setSelectedTeacher] = React.useState<TeacherType | null>(null)

  const [subjectTypes, setSubjectTypes] = React.useState<DistributedSubjectsType[]>([])

  const [currentFaculty, setCurrentFaculty] = React.useState('')
  const [currentSpecialty, setCurrentSpecialty] = React.useState('')
  const [currentGroup, setCurrentGroup] = React.useState('')

  const [currentGroupName, setCurrentGroupName] = React.useState('')

  const [openFilterModal, setOpenFilterModal] = React.useState(false)

  const [toggleEditTeacher, setToggleEditTeacher] = React.useState<'create' | 'remove'>('create')

  const [studentsCount, setStudentsCount] = React.useState<StudentsCountPropsType[]>([])

  React.useEffect(() => {
    if (institution) {
      dispatch(getAllDepartments(institution._id))
      dispatch(getAllFaculties(institution._id))
    }
  }, [institution])

  // Очищую distributedLoad
  React.useEffect(() => {
    dispatch(clearDistributedLoad())
    return () => {
      dispatch(clearDistributedLoad())
    }
  }, [])

  React.useEffect(() => {
    if (currentSpecialty) {
      dispatch(getGroups(currentSpecialty))
    }
  }, [currentSpecialty])

  React.useEffect(() => {
    if (selected !== null) {
      // @ts-ignore
      const { _id, name, semester, specialization, __v, groupId, institutionId, currentShowedYear, ...subject } =
        selected

      // @ts-ignore
      setSubjectTypes(() => {
        // @ts-ignore
        const keys = Object.keys(subject)

        const res = keys.map((el) => {
          let type

          if (el.includes('lectures')) type = 'Лекції'
          if (el.includes('practical')) type = 'Практичні'
          if (el.includes('laboratory')) type = 'Лабораторні'
          if (el.includes('seminars')) type = 'Семінари'
          if (el.includes('exams')) type = 'Екзамени'
          // @ts-ignore
          return [{ ...subject[el as keyof DistributedLoadSubjectsType], type, subjectType: el, subjectId: _id }]
        })

        return res.flat(2)
      })
    }
  }, [selected])

  React.useEffect(() => {
    // Встановлюю кількість студентів кожного виду занять для обраної дисципліни
    const data = subjectTypes.map((el) => {
      return { students: el.students, subjectType: el.subjectType }
    })
    setStudentsCount(data)
  }, [subjectTypes])

  const handleClickOpen = () => {
    setOpenFilterModal(true)
  }

  const handleClose = () => {
    setOpenFilterModal(false)
  }

  // Прикріпити 1 викладача
  const onAttachTeacher = async (subject: DistributedSubjectsType) => {
    if (selectedTeacher) {
      if (subject.stream) {
        // Якщо вибраний вид заняття об'єднаний в потік - викладач прикріплюється до кожної групи в потоці
        const streamGroupsCount = subject.stream.groups.length

        const attachTeacherPayload: AttachTeacherType[] = []

        for (let i = 0; i < streamGroupsCount; i++) {
          const attachElement = {
            groupId: subject.stream.groups[i],
            name: String(selected?.name),
            semester: String(selected?.semester),
            subjectType: subject.subjectType,
            _id: subject.subjectId,
            type: subject.type,
            hours: subject.hours,
            stream: subject.stream,
            teacher: String(selectedTeacher._id),
            subgroupNumber: subject.subgroupNumber,
            students: subject.students,
          }

          attachTeacherPayload.push(attachElement)
        }

        const { payload } = await dispatch(
          attachTeacher({ data: attachTeacherPayload, currentGroupId: String(selected?.groupId) }),
        )

        createAlertMessage(dispatch, payload, 'Викладача прикріплено', 'Помилка при прикріпленні викладача :(')

        if (payload) {
          setSelected(payload)
        }
      } else {
        // Якщо вибраний вид заняття не об'єднаний в потік - викладач прикріплюється тільки в даній групі
        const attachTeachertPayload = {
          _id: subject.subjectId,
          groupId: String(selected?.groupId),
          name: String(selected?.name),
          semester: String(selected?.semester),
          subjectType: subject.subjectType,
          type: subject.type,
          hours: subject.hours,
          stream: subject.stream,
          teacher: String(selectedTeacher._id),
          subgroupNumber: subject.subgroupNumber,
          students: subject.students,
        }

        const { payload } = await dispatch(
          attachTeacher({ data: [attachTeachertPayload], currentGroupId: String(selected?.groupId) }),
        )

        createAlertMessage(dispatch, payload, 'Викладача прикріплено', 'Помилка при прикріпленні викладача :(')

        if (payload) {
          setSelected(payload)
        }
      }
    } else {
      createAlertMessage(dispatch, false, '', 'Виберіть викладача!')
    }
  }

  // Прикріпити викладача до всіх видів занять
  const onAttachAllSubjects = async () => {
    if (selectedTeacher && selected) {
      const data = subjectTypes.map((el) => {
        if (el.stream && el.stream.groups.length > 1) {
          const streamGroupsCount = el.stream.groups.length

          const payload: AttachTeacherType[] = []

          const { subjectId, ...rest } = el

          for (let i = 0; i < streamGroupsCount; i++) {
            const attachElement = {
              ...rest,
              teacher: String(selectedTeacher._id),
              groupId: el.stream.groups[i],
              name: String(selected?.name),
              semester: String(selected?.semester),
            }

            payload.push(attachElement)
          }

          return payload
        } else {
          const { subjectId, ...rest } = el
          return {
            ...rest,
            teacher: String(selectedTeacher._id),
            _id: selected._id,
            groupId: String(selected?.groupId),
            name: String(selected?.name),
            semester: String(selected?.semester),
          }
        }
      })

      const { payload } = await dispatch(
        attachTeacher({ data: data.flat(), currentGroupId: String(selected?.groupId) }),
      )

      createAlertMessage(dispatch, payload, 'Викладача прикріплено', 'Помилка при прикріпленні викладача :(')

      if (payload) {
        setSelected(payload)
      }
    } else {
      createAlertMessage(dispatch, false, 'Викладача прикріплено', 'Виберіть викладача!')
    }
  }

  // Відкріпити викладача від 1 виду заняття
  const onUnattachTeacher = async (subject: DistributedSubjectsType) => {
    const attachTeacherPayload = {
      _id: subject.subjectId,
      name: String(selected?.name),
      semester: String(selected?.semester),
      groupId: String(selected?.groupId),
      subjectType: subject.subjectType,
      type: subject.type,
      hours: subject.hours,
      stream: subject.stream,
      teacher: null,
      subgroupNumber: subject.subgroupNumber,
      students: subject.students,
    }

    const { payload } = await dispatch(
      attachTeacher({ data: [attachTeacherPayload], currentGroupId: String(selected?.groupId) }),
    )

    createAlertMessage(dispatch, payload, 'Викладача відкріплено', 'Помилка при відкріпленні викладача :(')

    if (payload) {
      setSelected(payload)
    }
  }

  // Відкріпити викладача від всіх видів занять
  const onUnattachAllSubjects = async () => {
    const data = subjectTypes.map((el) => {
      // Якщо хоча б 1 вид занять об'єднаний в потік
      if (el.stream && el.stream.groups.length > 1) {
        const streamGroupsCount = el.stream.groups.length

        const payload: AttachTeacherType[] = []

        const { subjectId, ...rest } = el

        for (let i = 0; i < streamGroupsCount; i++) {
          const attachElement = {
            ...rest,
            teacher: null,
            groupId: el.stream.groups[i],
            name: String(selected?.name),
            semester: String(selected?.semester),
          }

          payload.push(attachElement)
        }

        return payload
      } else {
        const { subjectId, ...rest } = el

        return {
          ...rest,
          teacher: null,
          groupId: String(selected?.groupId),
          name: String(selected?.name),
          semester: String(selected?.semester),
        }
      }
    })

    const { payload } = await dispatch(attachTeacher({ data: data.flat(), currentGroupId: String(selected?.groupId) }))

    createAlertMessage(dispatch, payload, 'Викладача відкріплено', 'Помилка при відкріпленні викладача :(')

    if (payload) {
      setSelected(payload)
    }
  }

  const changeStudentsCount = (subjectType: string, students: string) => {
    setStudentsCount((prev) => {
      const newData = prev.map((el) => {
        if (el.subjectType === subjectType) {
          return { subjectType: el.subjectType, students }
        } else {
          return el
        }
      })

      return newData
    })
  }

  const onUpdateStudentsCount = async (subjectType: string, students: string) => {
    if (selected && currentGroup) {
      const updateStudentsCountPayload = {
        subjectType,
        students,
        _id: selected._id,
        groupId: currentGroup,
        name: selected.name,
        semester: selected.semester,
      }

      const { payload } = await dispatch(updateStudentsCount(updateStudentsCountPayload))
      createAlertMessage(dispatch, payload, 'Кількість студентів оновлено', 'Помилка при оновленні кількості студентів')
    } else {
      createAlertMessage(dispatch, null, '', 'Виберіть групу')
    }
  }

  return (
    <>
      <AlertMessage
        show={alertInfo.show}
        setShowError={setShowError}
        alertMessage={alertInfo.alertMessage}
        alertTitle={alertInfo.alertTitle}
        severity={alertInfo.severity}
      />

      <LoadDistributionGroupFilter
        setSubjectTypes={setSubjectTypes}
        setSelected={setSelected}
        openFilterModal={openFilterModal}
        handleClose={handleClose}
        faculties={faculties}
        currentGroup={currentGroup}
        setCurrentGroup={setCurrentGroup}
        setCurrentGroupName={setCurrentGroupName}
        currentSpecialty={currentSpecialty}
        setCurrentSpecialty={setCurrentSpecialty}
        currentFaculty={currentFaculty}
        setCurrentFaculty={setCurrentFaculty}
      />

      <Grid container spacing={2} className="load-distribution">
        <Grid item xs={4}>
          <Paper sx={{ mb: '16px' }} className="load-distribution__box">
            <div className="load-distribution__groups-top">
              <Typography className="load-distribution__title" align="center">
                {/* {`Розподіл навантаження групи ${currentGroupName}`} */}
                {currentGroupName ? `Група ${currentGroupName}` : 'Розподіл навантаження'}
              </Typography>
              <Tooltip title="Вибрати групу">
                <IconButton color="primary" className="load-distribution__groups-filter" onClick={handleClickOpen}>
                  <FilterIcon />
                </IconButton>
              </Tooltip>
            </div>

            <LoadDistributionTable
              selected={selected}
              setSelected={setSelected}
              loadingStatus={loadingStatus}
              distributedLoad={distributedLoad}
            />
          </Paper>
        </Grid>

        {/*  */}

        <Grid item xs={4}>
          <Paper sx={{ mb: '16px' }} className="load-distribution__box">
            <Typography className="load-distribution__title" align="center">
              {selected ? selected.name : 'Виберіть дисципліну'}
            </Typography>
            <Divider />
            <div className="load-distribution__icons-box">
              <Tooltip title="Відкріпити все">
                <IconButton color="error" onClick={onUnattachAllSubjects}>
                  <ClearAllIcon />
                </IconButton>
              </Tooltip>

              {toggleEditTeacher === 'create' ? (
                <Tooltip title="Відкріпити викладача">
                  <IconButton color="error" onClick={() => setToggleEditTeacher('remove')}>
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Прикріпити викладача">
                  <IconButton color="primary" onClick={() => setToggleEditTeacher('create')}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Прикріпити викладача на всі види занять">
                <IconButton color="primary" onClick={onAttachAllSubjects}>
                  <AddAllIcon />
                </IconButton>
              </Tooltip>
            </div>

            <Divider />

            <div className="load-distribution__block">
              <div className="load-distribution__subjects-box">
                {subjectTypes.length ? (
                  subjectTypes.map((el: DistributedSubjectsType, index) => {
                    return (
                      <Typography
                        key={index}
                        className="load-distribution__subjects-type"
                        align="center"
                        sx={{ whiteSpace: 'nowrap' }}>
                        {el.type}
                        {el.stream ? ` (${el.stream?.name})` : ''}
                        {el.subgroupNumber ? ` (п.${el.subgroupNumber})` : ''}
                      </Typography>
                    )
                  })
                ) : (
                  <></>
                )}
              </div>
              <div className="load-distribution__inputs-box">
                {subjectTypes.length ? (
                  subjectTypes.map((el: DistributedSubjectsType, index) => {
                    return (
                      <div style={{ whiteSpace: 'nowrap' }} key={index}>
                        <TextField
                          className="load-distribution__input"
                          variant="outlined"
                          value={
                            el.teacher !== null
                              ? `${el.teacher?.lastName} ${el.teacher?.firstName[0]}.${el.teacher?.middleName[0]}.`
                              : ''
                          }
                        />
                        {toggleEditTeacher === 'create' ? (
                          <Tooltip title="Прикріпити вибраного викладача">
                            <IconButton
                              color="primary"
                              className="load-distribution__input-button"
                              onClick={() => onAttachTeacher(el)}>
                              <AddIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Відкріпити викладача">
                            <IconButton
                              color="error"
                              className="load-distribution__input-button"
                              onClick={() => onUnattachTeacher(el)}>
                              <ClearIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <></>
                )}
              </div>
            </div>
          </Paper>

          <Paper>
            <Typography className="load-distribution__title" align="center">
              Кількість студентів:
            </Typography>
            <div className="load-distribution__block">
              <div className="load-distribution__subjects-box">
                {subjectTypes &&
                  subjectTypes.map((el: DistributedSubjectsType, index) => {
                    return (
                      <Typography
                        key={index}
                        className="load-distribution__subjects-type"
                        align="center"
                        sx={{ whiteSpace: 'nowrap' }}>
                        {el.type}
                        {el.stream ? ` (${el.stream?.name})` : ''}
                        {el.subgroupNumber ? ` (п.${el.subgroupNumber})` : ''}
                      </Typography>
                    )
                  })}
              </div>

              <div className="load-distribution__inputs-box">
                {studentsCount.map((el: StudentsCountPropsType, index) => (
                  <div className="load-distribution__row-box" key={index}>
                    <TextField
                      className="load-distribution__student-count-input"
                      variant="outlined"
                      type="number"
                      onChange={(e) => changeStudentsCount(el.subjectType, e.target.value)}
                      value={el.students}
                    />

                    <Tooltip title="Оновити" onClick={() => onUpdateStudentsCount(el.subjectType, el.students)}>
                      <IconButton color="primary" className="load-distribution__student-count-update-btn">
                        <ConfirmIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>
          </Paper>
        </Grid>

        {/*  */}

        <Grid item xs={4}>
          <Paper className="load-distribution__teachers-top">
            <Typography className="load-distribution__title" align="center">
              Викладачі
            </Typography>
          </Paper>
          <TheachersList
            departments={departments}
            selectedTeacher={selectedTeacher}
            setSelectedTeacher={setSelectedTeacher}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default LoadDistribution

// const onAttachTeacher = (subject: DistributedSubjectsType) => {
//   if (selectedTeacher) {
//     if (subject.stream) {
//       // Якщо вибраний вид заняття об'єднаний в потік - викладач прикріплюється до кожної групи в потоці
//       const streamGroupsCount = subject.stream.groups.length

//       const payload: AttachTeacherType[] = []

//       for (let i = 0; i < streamGroupsCount; i++) {
//         const attachElement = {
//           groupId: subject.stream.groups[i],
//           name: String(selected?.name),
//           semester: String(selected?.semester),
//           subjectType: subject.subjectType,
//           _id: subject.subjectId,
//           type: subject.type,
//           hours: subject.hours,
//           stream: subject.stream,
//           teacher: String(selectedTeacher._id),
//           subgroupNumber: subject.subgroupNumber,
//         }

//         payload.push(attachElement)
//       }

//       dispatch(attachTeacher({ data: payload, currentGroupId: String(selected?.groupId) })).then(({ payload }) => {
//         setSelected(payload)
//       })
//     } else {
//       // Якщо вибраний вид заняття не об'єднаний в потік - викладач прикріплюється тільки в даній групі
//       const payload = {
//         _id: subject.subjectId,
//         groupId: String(selected?.groupId),
//         name: String(selected?.name),
//         semester: String(selected?.semester),
//         subjectType: subject.subjectType,
//         type: subject.type,
//         hours: subject.hours,
//         stream: subject.stream,
//         teacher: String(selectedTeacher._id),
//         subgroupNumber: subject.subgroupNumber,
//       }
//       dispatch(attachTeacher({ data: [payload], currentGroupId: String(selected?.groupId) })).then(({ payload }) => {
//         setSelected(payload)
//       })
//     }
//   } else {
//     window.alert('Виберіть викладача!')
//   }
// }
