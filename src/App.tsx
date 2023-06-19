import React from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from './redux/store'
import { CssBaseline, ThemeProvider, useTheme } from '@mui/material'
import { Routes, Route, useNavigate } from 'react-router-dom'

import Home from './Pages/Home/Home'
import Streams from './Pages/Streams/Streams'
import Header from './component/Header/Header'
import AuthPage from './Pages/AuthPage/AuthPage'
import { ColorModeContext } from './TogleColorMode'
import SettingsPage from './Pages/Settings/SettingsPage'
import SchedulePage from './Pages/SchedulePage/SchedulePage'
import LoadDistribution from './Pages/LoadDistribution/LoadDistribution'
import { selectAuthData } from './redux/accountInfo/accountInfoSelector'
import EducationalPlans from './Pages/EducationalPlans/EducationalPlans'
import EducationalPlan from './component/EducationalPlan/EducationalPlan'
import { fetchInstitution, fetchMe } from './redux/accountInfo/accountInfoAsyncActions'
import TeachersAndDepartments from './Pages/TeachersAndDepartments/TeachersAndDepartments'
import LoadDistributionControl from './Pages/LoadDistributionControl/LoadDistributionControl'
import BuildingsAndAuditoriums from './Pages/BuildingsAndAuditoriums/BuildingsAndAuditoriums'
import ViewSchedulePage from './Pages/ViewSchedulePage/ViewSchedulePage'

const App: React.FC = () => {
  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const { userData } = useSelector(selectAuthData)

  const theme = useTheme()
  const colorMode = React.useContext(ColorModeContext)

  React.useEffect(() => {
    const fetchData = async () => {
      if (!userData) {
        if (globalThis.localStorage.getItem('token')) {
          const { payload } = await dispatch(fetchMe())

          if (payload) {
            dispatch(fetchInstitution(payload.institutionId))
          }
        } else {
          navigate('/auth')
        }
      }
    }
    fetchData()
  }, [userData])

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Header />
          <div className="app-wrapper">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/streams" element={<Streams />} />
              <Route path="/educational-plans" element={<EducationalPlans />} />
              <Route path="/educational-plans/:id" element={<EducationalPlan />} />
              <Route path="/teachers-and-departments" element={<TeachersAndDepartments />} />
              <Route path="/buildings-and-auditoriums" element={<BuildingsAndAuditoriums />} />
              <Route path="/load-distribution-control" element={<LoadDistributionControl />} />
              <Route path="/load-distribution" element={<LoadDistribution />} />

              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/settings" element={<SettingsPage colorMode={colorMode} />} />

              <Route path="/auth" element={<AuthPage />} />

              <Route path="/view-schedule" element={<ViewSchedulePage />} />
            </Routes>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App

/*
frontend 
0.
1. Баг при ондочасному об'єднанні одного виду занять в потік і видаленні іншого
2. Зробити пошук дисциплін в StreamsSubjectTable.tsx
3. Зробити зміну форми навчання для групи
4. Винести сортування даних в таблиці в окремий файл
5. Додати сторінку "Контроль вичитки годин"
6. Баг з видаленням компонента потоку

8. Не працює поділ на підгрупи якщо вибрані дисципліни, одна з яких поділена на підгрупи а інша ні !!!!!!!!!!!!!  
9. видалення декількох видів занять з потоку 

10. СТОРІНКА "Налаштування":
  - Налаштування кольорів занять
  - Перевірити, що буде коли встановлю початкову або кінцеву дату семестру в середині тижня !!!!
  - Розклад дзвінків
  - Color mode
  - Можливість створювати нові акаунти та давати їм ролі (з акаунта адміністратора)

11. shedulePage Якщо кількість виставлених пар === кількості фактичних пар, потрібно вимкнути можливість виставлення пар ???
13. Додавання декілька занять в певний час в різні тижні (ленти)
14. Копіювання розкладу (день) ??? хз
16. alert помилкок при завантаженні даних
17. alert при успішному створенні / оновленні / отриманні даних
18. При переключенні на розклад іншої групи, відображаються накладки попередньої групи ???
19. Зборонити ставити в один час підгрупи, в яких читає один викладач
20. Забрати стилізацію через глобальні класи MUI, зробити через theme.ts
21. В ScheduleSubjectTableBody при наведенні на заняття, що об'єднано в потік потрібно відображати всі групи потоку

23. Інтеграція з google calendar !important
24. Копіювання навчальних планів
25. refactor tables
26. Перенести всі selectors в appSelectors.ts 
27. Зробити фільтр та сортування дисциплін в таблицях: створення підгруп, створення спеціалізація, створення потоків
28. Назви груп, потоків (можливо ще щось) в межах організації мають бути унікальними ??? 
39. Заборонити ставити в розклад підгрупи, до яких підв'язаний один викладач
30 Зробити заміни викладача !important
31. Баг при копіюванні дисциплін, що об'єднані в потік CopyTheSchedule.tsx

32. Додати <Tooltip></Tooltip> з описом кнопок
33. Назва вибраної групи повинна відображатись в url
22. Додати можливість вказувати скільки студентів буде ходити пару (якщо група поділена на підгр. / об'єднана в потоки) !перевірити потоки
32. В таблиці streams потрібно фільтрувати дисципліни відповідно до вибраного навч. року



backend

1. Назви дисциплін повинні бути унікальними
2. При видаленні групи потрібно видаляти її навантаження (distributedLoad) та всі дисципліни (distributedLoadSubjects)
3. Замість костилів зробити { new: true }, Щоб повертався оновлений об'єкт
4. При видаленні групи - потрібно видаляти її ід в спеціальності specialties
*/

/* 
//  distributedloadsubjects  //
_id
groupId
institutionId
currentShowedYear
name
semester
specialization
lectures
laboratory_1
laboratory_2

//  subjectslists  //
_id
planId
name
totalHour
institutionId
semester_1
semester_2
semester_3
semester_4
semester_5
semester_6
semester_7
semester_8
semester_9
semester_10
semester_11
semester_12
createdAt
updatedAt


//  lessons  //
_id
groupId
name
groupName
hours
students
subjectType
teacher
auditory
remark
stream
semester
date
subjectNumber
institutionId
userId
*/
