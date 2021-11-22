export default [
  {
    id: 1,
    title: 'Event 1',
    // allDay: false,
    // desc: '',
    start: new Date(2021, 10, 11, 12, 0, 0),
    end: new Date(2021, 10, 11, 12, 30, 0),
  },
  {
    id: 2,
    title: 'Today',
    // allDay: false,
    // desc: '',
    start: new Date(new Date().setHours(new Date().getHours() - 1)),
    end: new Date(new Date().setHours(new Date().getHours() + 1)),
  },
  {
    id: 3,
    title: 'Event 2',
    // allDay: false,
    // desc: '',
    start: new Date(2021, 10, 7, 14, 0, 0),
    end: new Date(2021, 10, 7, 15, 0, 0),
  },
]
