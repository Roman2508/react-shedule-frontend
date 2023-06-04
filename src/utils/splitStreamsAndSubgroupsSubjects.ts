import { DistributedLoadSubjectsType } from '../redux/distributedLoad/distributedLoadTypes'

export const splitStreamsAndSubgroupsSubjects = (data: DistributedLoadSubjectsType[]) => {
  const res: DistributedLoadSubjectsType[] = []

  data.forEach((el) => {
    const copy = JSON.parse(JSON.stringify(el))

    const allKeys = Object.keys(copy)

    const subjectsKeys = allKeys.filter(
      (k) =>
        k.includes('lectures') ||
        k.includes('practical') ||
        k.includes('laboratory') ||
        k.includes('seminars') ||
        k.includes('exams'),
    )

    const initialData = {
      _id: copy._id,
      name: copy.name,
      specialization: copy.specialization,
      groupName: copy.groupName,
      groupId: copy.groupId,
      semester: copy.semester,
    }
    console.log(initialData)
    subjectsKeys.forEach((k) => {
      // Якщо є підгрупи
      if (k.includes('_')) {
        res.push({ ...initialData, [k]: copy[k] })
        delete copy[k]
      }
      // Якщо є потоки
      else if (copy[k].stream) {
        res.push({ ...initialData, [k]: copy[k] })
        delete copy[k]
      }
    })

    // Якщо немає підгруп та потоків
    res.push(copy)
  })

  return res
}
