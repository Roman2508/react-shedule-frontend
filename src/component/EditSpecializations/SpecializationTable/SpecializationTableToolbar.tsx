import * as React from 'react'
import { useSelector } from 'react-redux'
import Tooltip from '@mui/material/Tooltip'
import Toolbar from '@mui/material/Toolbar'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import CheckIcon from '@mui/icons-material/Check'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import Select, { SelectChangeEvent } from '@mui/material/Select'

import '../EditSpecializations.scss'
import createAlertMessage from '../../../utils/createAlertMessage'
import { selectAuthData } from '../../../redux/accountInfo/accountInfoSelector'
import {
  GroupLoadItemType,
  SelectedSpecializationSubjectType,
  SpecializationSubjectsType,
} from '../../../redux/group/groupTypes'
import { useAppDispatch } from '../../../redux/store'
import {
  addSubjectSpecialization,
  removeSpecializationSubject,
  updateSpecializationSubjects,
} from '../../../redux/group/groupAsyncAction'

type SpecializationTableToolbarPropType = {
  selectedSpecialization: string
  setSelectedSpecialization: (value: string) => void
  specializationsList: { _id: string; name: string }[]
  specializationsSubjects: SpecializationSubjectsType[]
  groupLoad: GroupLoadItemType[]
  selectedSubjects: SelectedSpecializationSubjectType | null
}

const SpecializationTableToolbar: React.FC<SpecializationTableToolbarPropType> = ({
  selectedSpecialization,
  setSelectedSpecialization,
  specializationsList,
  selectedSubjects,
  specializationsSubjects,
  groupLoad,
}) => {
  const dispatch = useAppDispatch()

  const { institution } = useSelector(selectAuthData)

  const handleChangeSpecialization = (event: SelectChangeEvent) => {
    setSelectedSpecialization(event.target.value)
  }

  const onChangeSubjectSpecialization = async () => {
    if (selectedSubjects) {
      const findedSpecializationsSubjects = specializationsSubjects.find(
        (el) => el.name === selectedSubjects.name && el.semester === selectedSubjects.semester,
      )

      const findedSpecialization = specializationsList.find((el) => el._id === selectedSpecialization)

      /* Оновлення спеціалізації */
      if (findedSpecializationsSubjects) {
        /* Якщо обрано створену спеціалізацію  */
        if (findedSpecialization) {
          const updateSpecializationPayload = {
            specializationId: findedSpecializationsSubjects._id,
            _id: findedSpecializationsSubjects.specialization._id,
            name: findedSpecialization.name,
          }

          const { payload } = await dispatch(updateSpecializationSubjects(updateSpecializationPayload))
          createAlertMessage(dispatch, payload, 'Спеціалізацю оновлено', 'Помилка при оновленні спеціалізації :(')
          /*  */
        } else if (selectedSpecialization === '111111111111111111111111') {
          /* Якщо було обрано "Не вивчається" */
          const updateSpecializationPayload = {
            specializationId: findedSpecializationsSubjects._id,
            name: 'Не вивчається',
            _id: '111111111111111111111111',
          }
          const { payload } = await dispatch(updateSpecializationSubjects(updateSpecializationPayload))
          createAlertMessage(dispatch, payload, 'Спеціалізацю оновлено', 'Помилка при оновленні спеціалізації :(')
          /*  */
        } else if (selectedSpecialization === '999') {
          /* Якщо було обрано "Спеціалізаія відсутня - видаляємо спеціалізацію" */
          const removeSpecializationPayload = { _id: findedSpecializationsSubjects._id, groupId: groupLoad[0].groupId }
          const { payload } = await dispatch(removeSpecializationSubject(removeSpecializationPayload))
          createAlertMessage(dispatch, payload, 'Спеціалізацю видалено', 'Помилка при видаленні спеціалізації :(')
        }
      }

      /* Створення нової спеціалізації */
      /* Якщо до дисципліни спеціалізація не була прикріплена - створюю спеціалізацію */
      if (!findedSpecializationsSubjects) {
        if (findedSpecialization) {
          /* Якщо до дисципліни спеціалізація не була прикріплена і було обрано якусь з створених спеціалізацій */
          const specialization = specializationsList.find((el) => el._id === selectedSpecialization)
          if (specialization && institution) {
            const { payload } = await dispatch(
              addSubjectSpecialization({
                ...selectedSubjects,
                groupId: groupLoad[0].groupId,
                institutionId: institution._id,
                specialization,
              }),
            )

            createAlertMessage(dispatch, payload, 'Додано спеціалізацію', 'Помилка при додаванні спеціалізації :(')
          }
          /*  */
        } else if (selectedSpecialization === '111111111111111111111111' && institution) {
          /* Якщо до дисципліни спеціалізація не була прикріплена і було обрано "Не вивчається" */

          const { payload } = await dispatch(
            addSubjectSpecialization({
              ...selectedSubjects,
              specialization: { name: 'Не вивчається', _id: '111111111111111111111111' },
              institutionId: institution._id,
              groupId: groupLoad[0].groupId,
            }),
          )

          createAlertMessage(dispatch, payload, 'Додано спеціалізацію', 'Помилка при додаванні спеціалізації :(')
        }
      }
    }
  }

  return (
    <Toolbar className="edit-specializations__top">
      <DialogTitle>Спеціалізовані підгрупи</DialogTitle>
      <div>
        <FormControl sx={{ display: 'flex', flexDirection: 'row' }} variant="standard">
          <Select
            value={selectedSpecialization}
            onChange={(e) => handleChangeSpecialization(e)}
            sx={{ width: '260px' }}>
            {specializationsList.map((el) => (
              <MenuItem key={el._id} value={el._id}>
                {el.name}
              </MenuItem>
            ))}
            <MenuItem value={'111111111111111111111111'}>Не вивчається</MenuItem>
            <MenuItem value={'999'}>Спеціалізація відсутня</MenuItem>
          </Select>

          <Tooltip title="Зберегти">
            <IconButton
              sx={{ marginLeft: '20px' }}
              onClick={onChangeSubjectSpecialization}
              disabled={!selectedSubjects}>
              <CheckIcon />
            </IconButton>
          </Tooltip>
        </FormControl>
      </div>
    </Toolbar>
  )
}

export default SpecializationTableToolbar
