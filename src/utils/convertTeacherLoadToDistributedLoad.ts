import { createSubjectType } from '../component/ScheduleAddModal/ScheduleSeveralSubjects'
import { SelectedDistributedLoadType } from '../redux/distributedLoad/distributedLoadTypes'
import { lessonsType } from '../redux/lessons/lessonsTypes'

const convertTeacherLoadToDistributedLoad = (lessons: lessonsType[]): SelectedDistributedLoadType[] => {
  const noDublicatedLessonsArray: SelectedDistributedLoadType[] = []

  lessons.forEach((el) => {
    const subjectType = createSubjectType(el)

    const someDublicatedLesson = noDublicatedLessonsArray.some((s) => {
      return s.name === el.name && s.type === el.subjectType && s.remark === el.remark
    })

    let streamInfo = null

    if (el.stream) {
      const streamComponentdId = el.stream.components.map((el) => el.groupId)

      streamInfo = {
        _id: el.stream._id,
        streamId: el.stream._id,
        name: el.stream.name,
        groups: streamComponentdId,
      }
    }

    if (!someDublicatedLesson) {
      const lessonItem = {
        groupId: el.groupId,
        groupName: el.groupName,
        hours: el.hours,
        name: el.name,
        remark: el.remark,
        semester: el.semester,
        specialization: null,
        subgroupNumber: null,
        stream: streamInfo,
        subjectType: subjectType.type,
        teacher: el.teacher,
        type: el.subjectType,
        _id: el._id,
      }

      noDublicatedLessonsArray.push(lessonItem)
    }
  })

  return noDublicatedLessonsArray
}

export default convertTeacherLoadToDistributedLoad
