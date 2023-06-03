import { LessonsListType } from '../component/ScheduleItem/ScheduleItem'
import { lessonsType } from '../redux/lessons/lessonsTypes'

export const setDublicatedLessonItems = (lessons: lessonsType[]) => {
  const dublicatedItems: LessonsListType[] = []

  lessons.forEach((el) => {
    const dublicated = dublicatedItems.find((s) => s.subjectNumber === el.subjectNumber && s.date === el.date)

    if (dublicated) {
      dublicatedItems.forEach((d) => {
        if (d.subjectNumber === dublicated.subjectNumber && d.date === dublicated.date) {
          //
          const some = d.items.some((s) => el.remark === s.remark)

          if (!some) {
            d.items = [...d.items, el]

            d.count = d.items.length
          }
        }
      })
    }

    if (!dublicated) {
      const currentItem = {
        items: [el],
        count: 1,
        subjectNumber: el.subjectNumber,
        date: el.date,
      }

      dublicatedItems.push(currentItem)
    }
  })

  return dublicatedItems
}
