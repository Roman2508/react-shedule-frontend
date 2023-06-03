import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { StyledClosedButton } from '../../theme'
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { SubgroupsSubjectsType, SubgroupsType } from '../../redux/group/groupTypes'
import { createSubgroups, removeSubgroups, updateSubgroups } from '../../redux/group/groupAsyncAction'
import { useAppDispatch } from '../../redux/store'
import { StreamsType } from '../../redux/streams/streamsTypes'
import { useSelector } from 'react-redux'
import { selectAuthData } from '../../redux/accountInfo/accountInfoSelector'
import createAlertMessage from '../../utils/createAlertMessage'

type EducationFormTypes = {
  name: string
  value: number | null
  type: string
  disabled: boolean
}

type EditSubgroupsModalModalPropsType = {
  openSubgroupsModal: boolean
  setOpenSubgroupsModal: (value: boolean) => void
  setSelectedItems: (value: SubgroupsSubjectsType[] | []) => void
  selectedItems: SubgroupsSubjectsType[] | []
  subgroups: SubgroupsType[]
  streams: StreamsType[]
}

const EditSubgroupsModal: React.FC<EditSubgroupsModalModalPropsType> = ({
  openSubgroupsModal,
  setOpenSubgroupsModal,
  setSelectedItems,
  selectedItems,
  subgroups,
  streams,
}) => {
  const dispatch = useAppDispatch()
  const { institution } = useSelector(selectAuthData)

  const [educationForm, setEducationForm] = React.useState<EducationFormTypes[]>([
    { name: 'Лекції', value: null, type: 'lectures', disabled: false },
    { name: 'Практичні', value: null, type: 'practical', disabled: false },
    { name: 'Лабораторні', value: null, type: 'laboratory', disabled: false },
    { name: 'Семінари', value: null, type: 'seminars', disabled: false },
    { name: 'Екзамени', value: null, type: 'exams', disabled: false },
  ])

  const handleDisabledInput = (el: EducationFormTypes) => {
    el.disabled = false

    for (let i = 0; i < selectedItems.length; i++) {
      //@ts-ignore
      const check = selectedItems[i][el.type]

      if (el.type === 'lectures' && check <= 0) {
        el.disabled = true
      }
      if (el.type === 'practical' && check <= 0) {
        el.disabled = true
      }
      if (el.type === 'laboratory' && check <= 0) {
        el.disabled = true
      }
      if (el.type === 'seminars' && check <= 0) {
        el.disabled = true
      }
      if (el.type === 'exams' && check <= 0) {
        el.disabled = true
      }
    }
  }

  React.useEffect(() => {
    if (selectedItems.length > 0) {
      setEducationForm((prev) => {
        const item = selectedItems[0].subgroups

        const res = prev.map((el) => {
          //@ts-ignore
          el.value = item[el.type]

          handleDisabledInput(el)

          return el
        })

        return res
      })
    }
  }, [selectedItems])

  const handleChange = (event: SelectChangeEvent<null | number>, name: string) => {
    setEducationForm((prev) => {
      const newData = prev.map((el) => {
        if (el.name === name) {
          event.target.value !== null ? (el.value = Number(event.target.value)) : (el.value = 1)
        }

        handleDisabledInput(el)

        return el
      })
      return newData
    })
  }

  const setSubgroupsCount = () => {
    const data = selectedItems.map((el) => {
      const res = {
        ...el.subgroups,
        lectures: null,
        practical: null,
        laboratory: null,
        seminars: null,
        exams: null,
      }

      educationForm.forEach((ef) => {
        //@ts-ignore
        if (el.type === res[el.type]) {
          if (ef.value === 1) {
            //@ts-ignore
            res[ef.type] = null
          } else {
            //@ts-ignore
            res[ef.type] = ef.value
          }
        }
      })
      return res
    })
    return data
  }

  const subgroupsData = setSubgroupsCount()

  // Створення підгруп
  const handleSubgroupsChange = async () => {
    /* Якщо кількість підгруп в кожному виді занятть === 1 або null (identifier === false), в іншому випадку (identifier === true) */
    const identifier = subgroupsData.map((el) => {
      const keys = Object.keys(el).filter(
        (f) =>
          f !== 'name' && f !== 'groupId' && f !== '_id' && f !== 'semester' && f !== '__v' && f !== 'institutionId',
      )
      const result = keys.map((k) => {
        //@ts-ignore
        return el[k]
      })

      if (result.some((s) => s !== 1 && s !== null)) {
        return true
      } else {
        return false
      }
    })

    if (!identifier.some((i) => i === false)) {
      /* Якщо для елемента була створена підгрупа повернеться true, в іншому випадку - false */
      const arrayChecks = subgroupsData.map((el) => {
        const res = subgroups.some((s) => s._id === el._id)
        return res
      })

      /* Перевіряємо чи хоч 1 елемент поділений на підгрупи */
      if (arrayChecks.some((a) => a === true)) {
        /* Якщо так - створюємо підгрупу для елемента який раніше не був поділений та оновлюємо елемент який вже був поділений */

        Promise.all(
          subgroupsData.map(async (el) => {
            if (subgroups.find((s) => s._id === el._id)) {
              /* Елемент був створений раніше - оновлюємо */
              const streamsDetails = streams.map((el) => el.details).flat(2)

              const some = streamsDetails.find((s) => {
                return s.name === el.name && s.semester === el.semester
              })

              if (some) {
                alert('Заборонено редагувати кількість підгруп в дисципліни, яка об`єднана в потік')
              }
              /*  */
              if (!some) {
                if (institution) {
                  const { payload } = await dispatch(updateSubgroups([{ ...el, institutionId: institution._id }]))
                  createAlertMessage(dispatch, payload, 'Підгрупу оновлено', 'Помилка при оновленні підгрупи :(')
                }
              }
            } else {
              /* Це новий елемент - створюю */

              const streamsDetails = streams.map((el) => el.details).flat(2)

              const some = streamsDetails.find((s) => {
                return s.name === el.name && s.semester === el.semester
              })
              if (some) {
                alert('Заборонено редагувати кількість підгруп в дисципліни, яка об`єднана в потік')
              }
              /*  */
              if (!some) {
                if (institution) {
                  const { payload } = await dispatch(createSubgroups([{ ...el, institutionId: institution._id }]))
                  createAlertMessage(dispatch, payload, 'Підгрупу створено', 'Помилка при створенні підгрупи :(')
                }
              }
            }
          }),
        )

        /*  */
      } else {
        /* Якщо ні - створюємо підгрупи для кожного вибраного елемента */
        let some

        subgroupsData.forEach((el) => {
          const streamsDetails = streams.map((el) => el.details).flat(2)

          some = streamsDetails.find((s) => {
            return s.name === el.name && s.semester === el.semester
          })
        })

        if (some) {
          // alert('Заборонено редагувати кількість підгруп в дисципліни, яка об`єднана в потік')
          createAlertMessage(
            dispatch,
            null,
            '',
            'Заборонено редагувати кількість підгруп в дисципліни, яка об`єднана в потік',
          )
        }

        if (!some) {
          if (institution) {
            const subgroupsDataWithInstitutionId = subgroupsData.map((el) => {
              return { ...el, institutionId: institution._id }
            })

            const { payload } = await dispatch(createSubgroups(subgroupsDataWithInstitutionId))
            createAlertMessage(dispatch, payload, 'Підгрупу створено', 'Помилка при створенні підгрупи :(')
          }
        }
      }
    } else {
      /* Якщо кількість підгруп в кожному виді занятть === 1 або null (identifier === false) - видаляємо підгрупи */

      Promise.all(
        subgroupsData.map(async (el) => {
          const removeSubgroupsPayload = { groupId: el.groupId, subgroupId: el._id }

          const streamsDetails = streams.map((el) => el.details).flat(2)

          const some = streamsDetails.find((s) => s.name === el.name && s.semester === el.semester)
          if (some) {
            alert('Заборонено редагувати кількість підгруп в дисципліни, яка об`єднана в потік')
          }

          if (!some) {
            const { payload } = await dispatch(removeSubgroups(removeSubgroupsPayload))
            createAlertMessage(dispatch, payload, 'Підгрупу видалено', 'Помилка при видаленні підгрупи :(')
          }
        }),
      )
    }
    setSelectedItems([])
  }

  const handleClose = () => {
    setOpenSubgroupsModal(false)
  }

  const subgroupsHandler = () => {
    handleSubgroupsChange()
    handleClose()
  }

  return (
    <Dialog open={openSubgroupsModal} onClose={handleClose}>
      <DialogTitle>Кількість підгруп</DialogTitle>
      <DialogContent>
        {educationForm.map((el, index) => {
          return (
            <FormControl disabled={el.disabled} sx={{ width: '100%', mb: '15px' }} variant="standard" key={index}>
              <InputLabel>{el.name}</InputLabel>
              <Select
                value={el.value === null ? 1 : el.value}
                onChange={(e) => handleChange(e, el.name)}
                label="educationForm">
                {[1, 2, 3, 4].map((el) => (
                  <MenuItem value={el} key={el}>
                    {el}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )
        })}
      </DialogContent>
      <DialogActions>
        <StyledClosedButton variant="outlined" onClick={handleClose}>
          Закрити
        </StyledClosedButton>
        <Button variant="contained" onClick={subgroupsHandler} autoFocus>
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditSubgroupsModal

// Створення підгруп
// const handleSubgroupsChange = () => {
//   /* Якщо кількість підгруп в кожному виді занятть === 1 або null (identifier === false), в іншому випадку (identifier === true) */
//   const identifier = subgroupsData.map((el) => {
//     const keys = Object.keys(el).filter(
//       (f) => f !== 'name' && f !== 'groupId' && f !== '_id' && f !== 'semester' && f !== '__v',
//     )
//     const result = keys.map((k) => {
//       //@ts-ignore
//       return el[k]
//     })

//     if (result.some((s) => s !== 1 && s !== null)) {
//       return true
//     } else {
//       return false
//     }
//   })

//   if (!identifier.some((i) => i === false)) {
//     /* Якщо для елемента була створена підгрупа повернеться true, в іншому випадку - false */
//     const arrayChecks = subgroupsData.map((el) => {
//       const res = subgroups.some((s) => s._id === el._id)
//       return res
//     })

//     /* Перевіряємо чи хоч 1 елемент поділений на підгрупи */
//     if (arrayChecks.some((a) => a === true)) {
//       /* Якщо так - створюємо підгрупу для елемента який раніше не був поділений та оновлюємо елемент який вже був поділений */

//       subgroupsData.forEach((el) => {
//         if (subgroups.find((s) => s._id === el._id)) {
//           /* Елемент був створений раніше - оновлюємо */
//           const streamsDetails = streams.map((el) => el.details).flat(2)

//           const some = streamsDetails.find((s) => {
//             return s.name === el.name && s.semester === el.semester
//           })

//           if (some) {
//             alert('Заборонено редагувати кількість підгруп в дисципліни, яка об`єднана в потік')
//           } else {
//             dispatch(updateSubgroups([el]))
//           }
//         } else {
//           /* Це новий елемент - створюємо */

//           const streamsDetails = streams.map((el) => el.details).flat(2)

//           const some = streamsDetails.find((s) => {
//             return s.name === el.name && s.semester === el.semester
//           })
//           if (some) {
//             alert('Заборонено редагувати кількість підгруп в дисципліни, яка об`єднана в потік')
//           } else {
//             dispatch(createSubgroups([el]))
//           }
//         }
//       })
//     } else {
//       /* Якщо ні - створюємо підгрупи для кожного вибраного елемента */
//       let some

//       subgroupsData.forEach((el) => {
//         const streamsDetails = streams.map((el) => el.details).flat(2)

//         some = streamsDetails.find((s) => {
//           return s.name === el.name && s.semester === el.semester
//         })
//       })
//       if (some) {
//         alert('Заборонено редагувати кількість підгруп в дисципліни, яка об`єднана в потік')
//       } else {
//         dispatch(createSubgroups(subgroupsData))
//       }
//     }
//   } else {
//     /* Якщо кількість підгруп в кожному виді занятть === 1 або null (identifier === false) - видаляємо підгрупи */

//     subgroupsData.forEach((el) => {
//       const payload = { groupId: el.groupId, subgroupId: el._id }

//       const streamsDetails = streams.map((el) => el.details).flat(2)

//       const some = streamsDetails.find((s) => s.name === el.name && s.semester === el.semester)
//       if (some) {
//         alert('Заборонено редагувати кількість підгруп в дисципліни, яка об`єднана в потік')
//       } else {
//         dispatch(removeSubgroups(payload))
//       }
//     })
//   }
//   setSelectedItems([])
// }
