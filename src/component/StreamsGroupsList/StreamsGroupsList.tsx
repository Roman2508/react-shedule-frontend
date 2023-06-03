import * as React from 'react'
import Paper from '@mui/material/Paper'
import { useSelector } from 'react-redux'
import Divider from '@mui/material/Divider'
import AddIcon from '@mui/icons-material/Add'
import Skeleton from '@mui/material/Skeleton'
import Accordion from '@mui/material/Accordion'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ListItemButton from '@mui/material/ListItemButton'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AccordionSummary from '@mui/material/AccordionSummary'

import './StreamsGroupsList.scss'
import SkeletonBlock from '../SkeletonBlock'
import { useAppDispatch } from '../../redux/store'
import { GroupType } from '../../redux/group/groupTypes'
import { selectGroups } from '../../redux/group/groupSelector'
import { StreamsType } from '../../redux/streams/streamsTypes'
import createAlertMessage from '../../utils/createAlertMessage'
import { StyledAccordioDetailsWithoutPaddings } from '../../theme'
import { createStreamComponent } from '../../redux/streams/streamsAsyncActions'
import { FacultyType, SpecialtyType } from '../../redux/faculties/facultiesTypes'

type StreamsGroupsListPropsType = {
  faculties: [] | FacultyType[]
  setActiveSpecialtyItem: (value: SpecialtyType) => void
  setActiveStream: (value: StreamsType) => void
  activeStream: StreamsType | null
}

const StreamsGroupsList: React.FC<StreamsGroupsListPropsType> = ({
  faculties,
  setActiveSpecialtyItem,
  setActiveStream,
  activeStream,
}) => {
  const dispatch = useAppDispatch()

  const { partTimeGroups, fullTimeGroups } = useSelector(selectGroups)

  const [mainExpanded, setMainExpanded] = React.useState<string | false>(false)
  const [itemExpanded, setItemExpanded] = React.useState<string | false>(false)

  // const [selectedGroup, setSelectedGroup] = React.useState<GroupType | null>(null)

  const allGroupsList = fullTimeGroups !== null && partTimeGroups !== null && [...fullTimeGroups, ...partTimeGroups]

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setMainExpanded(isExpanded ? panel : false)
  }
  const handleItemChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setItemExpanded(isExpanded ? panel : false)
  }

  const onSelectGroup = async (group: GroupType) => {
    // setSelectedGroup(group)
    if (activeStream) {
      if (window.confirm(`Ви дійсно хочете додати групу ${group.name} до потоку ${activeStream.name}?`)) {
        const createStreamComponentPayload = {
          _id: activeStream._id,
          name: group.name,
          groupId: group._id,
          groupLoad: group.groupLoad as unknown as string,
        }

        const { payload } = await dispatch(createStreamComponent(createStreamComponentPayload))
        createAlertMessage(
          dispatch,
          payload,
          `Група ${group.name} додана до потоку ${activeStream.name}`,
          'Помилка при додаванні групи в потік :(',
        )
        setActiveStream(payload)
      }
    } else {
      createAlertMessage(dispatch, false, '', 'Виберіть потік')
      // alert('Виберіть потік')
    }
  }

  return (
    <div>
      <Paper>
        <Typography className="streamsGroupList__title" align={'center'} variant={'subtitle1'}>
          Групи
        </Typography>
      </Paper>
      {faculties.length > 0 ? (
        faculties.map((el: FacultyType) => (
          <Accordion
            expanded={mainExpanded === `panel${el._id}`}
            onChange={handleChange(`panel${el._id}`)}
            key={el._id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
              <Typography>{el.name}</Typography>
            </AccordionSummary>
            <Divider />
            <StyledAccordioDetailsWithoutPaddings>
              {el.specialties.map((item: any) => (
                <Accordion
                  expanded={itemExpanded === `panel${item._id}`}
                  onChange={handleItemChange(`panel${item._id}`)}
                  key={item._id}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={() => setActiveSpecialtyItem(item)}>
                    <Typography>{item.name}</Typography>
                  </AccordionSummary>
                  <StyledAccordioDetailsWithoutPaddings>
                    {allGroupsList ? (
                      <>
                        {allGroupsList.map((group, index: number) => {
                          const isDisabled = activeStream?.components.some((el) => el.groupId === group._id)

                          return (
                            <React.Fragment key={index}>
                              <Divider />
                              <ListItemButton
                                disabled={isDisabled}
                                // selected={selectedMainIndex === item._id}
                                // onClick={(event) => handleMaitItemClick(event, item._id)}
                                className="structural-units-item"
                                sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography noWrap={true} variant="subtitle1">
                                  {group.name}
                                </Typography>
                                {/* <ListItemText primary={item.name} /> */}
                                <IconButton
                                  sx={{ minWidth: 'auto', padding: '5px' }}
                                  onClick={() => onSelectGroup(group)}>
                                  <AddIcon />
                                </IconButton>
                              </ListItemButton>
                            </React.Fragment>
                          )
                        })}
                      </>
                    ) : (
                      <Skeleton variant="rounded" width={'calc(100% - 10px)'} height={46} sx={{ margin: '5px' }} />
                    )}
                  </StyledAccordioDetailsWithoutPaddings>
                </Accordion>
              ))}
            </StyledAccordioDetailsWithoutPaddings>
          </Accordion>
        ))
      ) : (
        <SkeletonBlock />
      )}
    </div>
  )
}

export default StreamsGroupsList

//  <StyledAccordioDetailsWithoutPaddings>
// {fullTimeGroups !== null && partTimeGroups !== null ? (
//   <>
//     {/* <Divider />
//     <Divider sx={{ padding: '10px 0' }}>
//       <Chip label={'Денна форма'} />
//     </Divider> */}

//     {fullTimeGroups.map((group, index: number) => {
//       const isDisabled = activeStream?.components.some((el) => el.groupId === group._id)

//       return (
//         <React.Fragment key={index}>
//           <Divider />
//           <ListItemButton
//             disabled={isDisabled}
//             // selected={selectedMainIndex === item._id}
//             // onClick={(event) => handleMaitItemClick(event, item._id)}
//             className="structural-units-item"
//             sx={{ display: 'flex', justifyContent: 'space-between' }}>
//             <Typography noWrap={true} variant="subtitle1">
//               {group.name}
//             </Typography>
//             {/* <ListItemText primary={item.name} /> */}
//             <IconButton
//               sx={{ minWidth: 'auto', padding: '5px' }}
//               onClick={() => onSelectGroup(group)}>
//               <AddIcon />
//             </IconButton>
//           </ListItemButton>
//         </React.Fragment>
//       )
//     })}

//     {/* <Divider />
//     <Divider sx={{ padding: '10px 0' }}>
//       <Chip label={'Заочна форма'} />
//     </Divider> */}

//     {partTimeGroups.map((group, index: number) => {
//       const isDisabled = activeStream?.components.some((el) => el.groupId === group._id)

//       return (
//         <React.Fragment key={index}>
//           <Divider />
//           <ListItemButton
//             disabled={isDisabled}
//             // selected={selectedMainIndex === item._id}
//             // onClick={(event) => handleMaitItemClick(event, item._id)}
//             className="structural-units-item"
//             sx={{ display: 'flex', justifyContent: 'space-between' }}>
//             <Typography noWrap={true} variant="subtitle1">
//               {group.name}
//             </Typography>
//             {/* <ListItemText primary={item.name} /> */}
//             <IconButton
//               sx={{ minWidth: 'auto', padding: '5px' }}
//               onClick={() => onSelectGroup(group)}>
//               <AddIcon />
//             </IconButton>
//           </ListItemButton>
//         </React.Fragment>
//       )
//     })}
//   </>
// ) : (
//   <Skeleton variant="rounded" width={'calc(100% - 10px)'} height={46} sx={{ margin: '5px' }} />
// )}
// </StyledAccordioDetailsWithoutPaddings>
