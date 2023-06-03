import React from 'react'
import Typography from '@mui/material/Typography'
import TimeIcon from '@mui/icons-material/Update'

import './ViewSchedulePage.scss'

const lessons = [
  {
    _id: 1,
    days: [
      {
        _id: 1,
        date: '05.05.2023 р. Понеділок',
        items: [
          {
            _id: 1,
            subjectNumber: 1,
            subjectTime: '08:15-09:35',
            name: 'Гроші та кредит Гроші та кредит Гроші та кредит',
            subjectType: 'ЛК',
            auditory: 106,
            teacher: 'Шубенко І.А.',
          },
          {
            _id: 1,
            subjectNumber: 2,
            subjectTime: '09:50-11:10',
            name: 'Гроші та кредит1',
            subjectType: 'ЛК',
            auditory: 106,
            teacher: 'Шубенко І.А.',
          },
          {
            _id: 1,
            subjectNumber: 3,
            subjectTime: '08:15-09:35',
            name: 'Гроші та кредит2',
            subjectType: 'ЛК',
            auditory: 106,
            teacher: 'Шубенко І.А.',
          },
          {
            _id: 1,
            subjectNumber: 4,
            subjectTime: '08:15-09:35',
            name: 'Гроші та кредит3',
            subjectType: 'ЛК',
            auditory: 106,
            teacher: 'Шубенко І.А.',
          },
        ],
      },
      {
        _id: 1,
        date: '05.05.2023 р. Вівторок',
        items: [
          {
            _id: 1,
            subjectNumber: 1,
            subjectTime: '08:15-09:35',
            name: 'Гроші та кредит',
            subjectType: 'ЛК',
            auditory: 106,
            teacher: 'Шубенко І.А.',
          },
          {
            _id: 1,
            subjectNumber: 1,
            subjectTime: '08:15-09:35',
            name: 'Гроші та кредит',
            subjectType: 'ЛК',
            auditory: 106,
            teacher: 'Шубенко І.А.',
          },
          {
            _id: 1,
            subjectNumber: 1,
            subjectTime: '08:15-09:35',
            name: 'Гроші та кредит',
            subjectType: 'ЛК',
            auditory: 106,
            teacher: 'Шубенко І.А.',
          },
        ],
      },
      {
        _id: 1,
        date: '05.05.2023 р. Середа',
        items: [
          {
            _id: 1,
            subjectNumber: 1,
            subjectTime: '08:15-09:35',
            name: 'Гроші та кредит',
            subjectType: 'ЛК',
            auditory: 106,
            teacher: 'Шубенко І.А.',
          },
          {
            _id: 1,
            subjectNumber: 1,
            subjectTime: '08:15-09:35',
            name: 'Гроші та кредит',
            subjectType: 'ЛК',
            auditory: 106,
            teacher: 'Шубенко І.А.',
          },
          {
            _id: 1,
            subjectNumber: 1,
            subjectTime: '08:15-09:35',
            name: 'Гроші та кредит',
            subjectType: 'ЛК',
            auditory: 106,
            teacher: 'Шубенко І.А.',
          },
        ],
      },
      {
        _id: 1,
        date: "05.05.2023 р. П'ятниця",
        items: [
          {
            _id: 1,
            subjectNumber: 1,
            subjectTime: '08:15-09:35',
            name: 'Гроші та кредит',
            subjectType: 'ЛК',
            auditory: 106,
            teacher: 'Шубенко І.А.',
          },
          {
            _id: 1,
            subjectNumber: 1,
            subjectTime: '08:15-09:35',
            name: 'Гроші та кредит',
            subjectType: 'ЛК',
            auditory: 106,
            teacher: 'Шубенко І.А.',
          },
          {
            _id: 1,
            subjectNumber: 1,
            subjectTime: '08:15-09:35',
            name: 'Гроші та кредит',
            subjectType: 'ЛК',
            auditory: 106,
            teacher: 'Шубенко І.А.',
          },
        ],
      },
    ],
  },
]

const ViewSchedulePage = () => {
  return (
    <div className="view-schedule">
      <Typography className="view-schedule__title" variant="h6">
        Розклад занять
      </Typography>
      <Typography className="view-schedule__title" variant="h6">
        Поліський національний університет
      </Typography>
      <div className="view-schedule__group-filter"></div>
      <div className="view-schedule__schedule">
        {lessons.map((week) => (
          <div className="view-schedule__week">
            {week.days.map((day) => (
              <div className="view-schedule__schedule-day">
                <div className="view-schedule__schedule-date">
                  <TimeIcon sx={{ width: '20px' }} />
                  {day.date}
                </div>
                <div className="view-schedule__schedule-subjects">
                  {day.items.map((lesson) => (
                    <div className="view-schedule__schedule-row">
                      <div className="view-schedule__schedule-subject-number">{lesson.subjectNumber}.</div>

                      <div className="view-schedule__schedule-time">{lesson.subjectTime}</div>
                      
                      <div className="view-schedule__schedule-info">
                        <p>
                          {lesson.name} ({lesson.subjectType})
                        </p>
                        <p>{lesson.auditory}</p> <p>{lesson.teacher}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ViewSchedulePage
