import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import { EducationalPlanGroupsType, EducationalPlanType } from '../redux/educationalPlan/educationalPlanTypes'
import { StyledClosedButton } from '../theme'
import { GroupInfoTypes } from '../api/apiTypes'
import CircularPreloader from './CircularPreloader'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

type SelectEducationalPlanPropsType = {
  open: boolean
  setOpen: (value: boolean) => void
  plans: EducationalPlanGroupsType[] | null
  groupInfoValues: GroupInfoTypes
  onChangeGroupInfo: (type: string, value: string) => void
  setSelectedPlanName: (value: string) => void
}

const SelectEducationalPlan: React.FC<SelectEducationalPlanPropsType> = ({
  open,
  setOpen,
  plans,
  groupInfoValues,
  onChangeGroupInfo,
  setSelectedPlanName,
}) => {
  const handleClose = () => {
    setOpen(false)
  }

  if (!plans) {
    return <CircularPreloader />
  }

  const onChangePlan = (p: EducationalPlanType) => {
    onChangeGroupInfo('EducationPlanId', String(p._id))
    setSelectedPlanName(p.name)
  }

  return (
    <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose}>
      <DialogTitle>{'Навчальні плани:'}</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0, minWidth: '400px !important' }}>
        {plans.map((el) => (
          <div style={{ marginBottom: '20px' }} key={el._id}>
            <Divider>
              <Chip label={el.name} />
            </Divider>

            <FormControl>
              <RadioGroup>
                {el.plans.map((p) => (
                  <FormControlLabel
                    key={p._id}
                    value={p._id}
                    onClick={() => onChangePlan(p)}
                    control={<Radio checked={groupInfoValues.EducationPlanId === String(p._id)} />}
                    label={p.name}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Зберегти</Button>
        <StyledClosedButton onClick={handleClose}>Закрити</StyledClosedButton>
      </DialogActions>
    </Dialog>
  )
}

export default SelectEducationalPlan
