import { DistributedSubjectType } from '../redux/distributedLoad/distributedLoadTypes'
import { DistributedLoadSubjectsType } from '../redux/distributedLoad/distributedLoadTypes'

export const createSubjectRemark = (loadItem: DistributedLoadSubjectsType, currentSubject?: DistributedSubjectType) => {
  let remark = ''

  if (!currentSubject) return remark

  if (loadItem.specialization) {
    remark = loadItem.specialization.name
  } else if (currentSubject.stream && currentSubject.subgroupNumber) {
    remark = `${currentSubject.stream.name} (підгр.${currentSubject.subgroupNumber})`
  } else if (currentSubject.stream) {
    remark = currentSubject.stream.name
  } else if (currentSubject.subgroupNumber) {
    remark = `підгр.${currentSubject.subgroupNumber}`
  } else {
    remark = ''
  }

  return remark
}
