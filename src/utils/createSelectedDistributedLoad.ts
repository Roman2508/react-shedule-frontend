import { DistributedLoadSubjectsType, SelectedDistributedLoadType } from '../redux/distributedLoad/distributedLoadTypes'

export const createSelectedDistributedLoad = (
  distributedLoad: DistributedLoadSubjectsType[],
  currentSemester: string,
  groupName: string,
): SelectedDistributedLoadType[] => {
  if (distributedLoad) {
    const newDistributedLoad = distributedLoad.map((el) => {
      const firstSemesters = ['1', '3', '5', '7']
      const secondSemesters = ['2', '4', '6', '8']

      const showedSemesters = firstSemesters.some((s) => s === currentSemester) ? firstSemesters : secondSemesters

      // if (el.semester === currentSemester) {
      if (showedSemesters.some((s) => s === el.semester)) {
        const keys = Object.keys(el).filter(
          (k) =>
            k !== 'name' &&
            k !== 'groupId' &&
            k !== 'groupName' &&
            k !== 'specialization' &&
            k !== '_id' &&
            k !== 'semester' &&
            k !== 'currentShowedYear' &&
            k !== '__v' &&
            k !== 'institutionId',
        )

        const subjects = keys.map((k) => {
          // @ts-ignore
          const obj: DistributedSubjectType = { ...el[k as keyof DistributedLoadSubjectsType] }

          // @ts-ignore
          if (obj.type === 'Лекції') {
            // @ts-ignore
            obj.subjectType = 'ЛК'
          }
          if (obj.type === 'Практичні') {
            // @ts-ignore
            obj.subjectType = 'ПЗ'
          }
          if (obj.type === 'Лабораторні') {
            // @ts-ignore
            obj.subjectType = 'ЛАБ'
          }
          if (obj.type === 'Семінари') {
            // @ts-ignore
            obj.subjectType = 'СЕМ'
          }
          if (obj.type === 'Екзамени') {
            // @ts-ignore
            obj.subjectType = 'ЕКЗ'
          }

          let remark: string

          if (el.specialization) {
            remark = el.specialization.name
          } else if (obj.stream && obj.subgroupNumber) {
            remark = `${obj.stream.name} (підгр.${obj.subgroupNumber})`
          } else if (obj.stream) {
            remark = obj.stream.name
          } else if (obj.subgroupNumber) {
            remark = `підгр.${obj.subgroupNumber}`
          } else {
            remark = '-'
          }

          if (obj.teacher !== null) {
            const currentGroupName = el.groupName ? el.groupName : groupName

            const lessonItem = {
              ...obj,
              remark,
              type: k,
              _id: el._id,
              name: el.name,
              groupId: el.groupId,
              semester: el.semester,
              groupName: currentGroupName,
              specialization: el.specialization,
            }

            return lessonItem
          }
        })

        return subjects
      }

      return
    })

    const filtredDistributedLoad = newDistributedLoad.flat(2).filter((el) => el !== undefined)

    const noDublicatedDistributedLoadArray: SelectedDistributedLoadType[] = []

    filtredDistributedLoad.forEach((el) => {
      const someDublicatedLesson = noDublicatedDistributedLoadArray.some((s) => {
        return s.name === el.name && s.remark === el.remark && s.type === el.type && s.groupId === el.groupId
      })

      if (!someDublicatedLesson) {
        noDublicatedDistributedLoadArray.push(el)
      }
    })

    return noDublicatedDistributedLoadArray
  } else {
    return []
  }
}
