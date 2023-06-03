import React from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { useSelector } from 'react-redux'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import FormGroup from '@mui/material/FormGroup'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ListItemButton from '@mui/material/ListItemButton'
import EditIcon from '@mui/icons-material/ModeEditOutlined'
import SearchIcon from '@mui/icons-material/SearchOutlined'
import FormControlLabel from '@mui/material/FormControlLabel'
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded'

import './Streams.scss'
import { StyledClosedButton } from '../../theme'
import { useAppDispatch } from '../../redux/store'
import AlertMessage from '../../component/AlertMessage'
import { selectAlerts } from '../../redux/appSelectors'
import SkeletonBlock from '../../component/SkeletonBlock'
import { AppLoadingStatusTypes } from '../../redux/appTypes'
import { setShowError } from '../../redux/alerts/alertsSlise'
import { getGroups } from '../../redux/group/groupAsyncAction'
import createAlertMessage from '../../utils/createAlertMessage'
import CircularPreloader from '../../component/CircularPreloader'
import { ListSubjectType } from '../../utils/createListOfSubjects'
import { selectStreams } from '../../redux/streams/streamsSelector'
import { SpecialtyType } from '../../redux/faculties/facultiesTypes'
import { selectFaculties } from '../../redux/faculties/facultiesSelectors'
import { selectAuthData } from '../../redux/accountInfo/accountInfoSelector'
import { getAllFaculties } from '../../redux/faculties/facultiesAsyncAction'
import StreamsGroupsList from '../../component/StreamsGroupsList/StreamsGroupsList'
import { StreamsComponentsType, StreamsType } from '../../redux/streams/streamsTypes'
import StreamsCreateModal from '../../component/StreamsCreateModal/StreamsCreateModal'
import StreamsSubjectTable from '../../component/StreamsSubjectTable/StreamsSubjectTable'
import { getStreams, removeStream, removeStreamsComponent } from '../../redux/streams/streamsAsyncActions'

const Streams = () => {
  const dispatch = useAppDispatch()

  const alertInfo = useSelector(selectAlerts)
  const { faculties } = useSelector(selectFaculties)
  const { institution } = useSelector(selectAuthData)
  const { streams, loadingStatus } = useSelector(selectStreams)

  const [openModal, setOpenModal] = React.useState(false)
  const [modalType, setModalType] = React.useState<'create' | 'update'>('create')

  const [activeStream, setActiveStream] = React.useState<StreamsType | null>(null)
  const [activeStreamComponent, setActiveStreamComponent] = React.useState<StreamsComponentsType | null>(null)

  const [showMergedItems, setShowMergedItems] = React.useState(false)
  const [activeSpecialtyItem, setActiveSpecialtyItem] = React.useState<SpecialtyType>()

  React.useEffect(() => {
    if (institution) {
      dispatch(getAllFaculties(institution._id))
      dispatch(getStreams(institution._id))
    }
  }, [institution])

  React.useEffect(() => {
    if (activeSpecialtyItem) {
      dispatch(getGroups(activeSpecialtyItem._id))
    }
  }, [activeSpecialtyItem])

  const onCreateNewStream = () => {
    setModalType('create')
    setOpenModal(true)
  }

  const onUpdateStream = () => {
    setModalType('update')
    setOpenModal(true)
  }

  // Видалення потоку
  const onRemoveStream = async (id: string) => {
    const stream = streams.find((el) => el._id === id)

    if (stream?.components.length === 0) {
      if (window.confirm('Ви дійсно хочете видалити потік?')) {
        const { payload } = await dispatch(removeStream(id))
        createAlertMessage(dispatch, payload, 'Потік видалено', 'Помилка при видаленні потоку :(')
      }
    } else {
      // alert('Для видалення потоку потрібно спочатку очистити склад потоку')
      createAlertMessage(dispatch, false, '', 'Для видалення потоку потрібно очистити склад потоку')
    }
  }

  // Видалення групи з потоку
  const onRemoveStreamComponent = async (component: StreamsComponentsType) => {
    setActiveStreamComponent(component)

    if (activeStream && activeStreamComponent) {
      if (
        window.confirm(
          `Ви дійсно хочете видалити групу ${activeStreamComponent.name} з складу потоку ${activeStream.name}?`,
        )
      ) {
        const removeStreamComponentsPayload = {
          _id: activeStreamComponent._id,
          streamId: activeStream._id,
        }

        const { payload } = await dispatch(removeStreamsComponent(removeStreamComponentsPayload))
        createAlertMessage(
          dispatch,
          payload,
          `Група ${activeStreamComponent.name} видалена з потоку ${activeStream.name}`,
          'Помилка при видаленні групи з потоку :(',
        )

        setActiveStream((prev) => {
          if (prev !== null) {
            if (prev._id === payload.streamId) {
              const newComponents = prev.components.filter((c) => c._id !== payload.id)

              return {
                ...prev,
                components: newComponents,
              }
            }

            return prev
          } else {
            return null
          }
        })
      }
    }
  }

  const filterMergedSubjects = (subjects: ListSubjectType[]) => {
    if (showMergedItems) {
      const newSubject = subjects.filter((subject) => {
        const some = []

        if (subject.details) {
          const keys = Object.keys(subject.details)

          keys.forEach((key) => {
            // @ts-ignore
            if (subject.details[key] === true) {
              some.push(key)
            }
          })
        }

        if (some.length) {
          return true
        } else {
          return false
        }
      })

      return newSubject
    } else {
      return subjects
    }
  }

  if (!institution) {
    return <CircularPreloader />
  }

  return (
    <>
      <AlertMessage
        show={alertInfo.show}
        setShowError={setShowError}
        severity={alertInfo.severity}
        alertTitle={alertInfo.alertTitle}
        alertMessage={alertInfo.alertMessage}
      />

      <StreamsCreateModal
        openModal={openModal}
        modalType={modalType}
        setOpenModal={setOpenModal}
        activeStream={activeStream}
        institutionId={institution._id}
        setActiveStream={setActiveStream}
      />

      <Grid className="streams" container spacing={2}>
        <Grid className="streams__left" item xs={4}>
          {/* StreamsGroupsList */}

          <StreamsGroupsList
            faculties={faculties}
            activeStream={activeStream}
            setActiveStream={setActiveStream}
            setActiveSpecialtyItem={setActiveSpecialtyItem}
          />

          {/* StreamsGroupsList */}
        </Grid>
        <Grid className="streams__right" item xs={8}>
          <div className="streams__top-box">
            {/*  */}

            <Paper className="streams__stream-list">
              <Typography className="streams__title" align="center">
                Потоки
              </Typography>
              <Divider />

              <div className="streams__list-box">
                {streams.length > 0 || loadingStatus !== AppLoadingStatusTypes.LOADING ? (
                  streams.map((el) => (
                    <React.Fragment key={el._id}>
                      <ListItemButton
                        selected={activeStream?._id === el._id}
                        onClick={() => setActiveStream(el)}
                        className="structural-units-item streams__list-item"
                        sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography noWrap={true} variant="subtitle1">
                          {el.name}
                        </Typography>

                        {/*  */}

                        <div className="streams__list-controls">
                          <IconButton
                            sx={{ minWidth: 'auto', padding: '5px', marginRight: '5px' }}
                            onClick={onUpdateStream}>
                            <EditIcon />
                          </IconButton>
                          <IconButton sx={{ minWidth: 'auto', padding: '5px' }} onClick={() => onRemoveStream(el._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </ListItemButton>
                      <Divider />
                    </React.Fragment>
                  ))
                ) : (
                  <SkeletonBlock />
                )}
              </div>

              <StyledClosedButton onClick={onCreateNewStream} fullWidth>
                Додати новий потік +
              </StyledClosedButton>
            </Paper>

            {/*  */}

            <Paper className="streams__group-composition">
              <Typography className="streams__title" align="center">
                {activeStream ? `Склад потоку ${activeStream.name}` : 'Виберіть потік'}
              </Typography>
              <Divider />

              <div className="streams__group-composition-box">
                {(activeStream ? activeStream.components : []).map((component) => (
                  <React.Fragment key={component._id}>
                    <ListItemButton
                      selected={activeStreamComponent?._id === component._id}
                      onClick={() => setActiveStreamComponent(component)}
                      className="structural-units-item"
                      sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography noWrap={true} variant="subtitle1">
                        {component.name}
                      </Typography>

                      {/*  */}

                      <IconButton
                        sx={
                          activeStreamComponent?._id === component._id
                            ? { minWidth: 'auto', padding: '5px' }
                            : { minWidth: 'auto', padding: '5px', display: 'none' }
                        }
                        onClick={() => onRemoveStreamComponent(component)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemButton>
                    <Divider />
                  </React.Fragment>
                ))}
              </div>
            </Paper>

            {/*  */}
          </div>
          <Paper className="streams__subjects-box">
            <div className="streams__subjects-top">
              <Typography className="streams__title streams__title-group">
                {activeStream ? `${activeStream.name}` : 'Виберіть потік'}
              </Typography>

              <div className="streams__input-box">
                <SearchIcon className="streams__input-icon" />
                <TextField id="standard-bare" placeholder="Пошук…" margin="normal" />
              </div>

              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={showMergedItems} onClick={() => setShowMergedItems(!showMergedItems)} />}
                  label="Показати об’єднані елементи"
                />
              </FormGroup>
            </div>
            <StreamsSubjectTable
              showMergedItems={showMergedItems}
              activeStream={activeStream}
              filterMergedSubjects={filterMergedSubjects}
              setActiveStream={setActiveStream}
            />
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

export default Streams
