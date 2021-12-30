import React, { useEffect, useState } from 'react'
import { Calendar, Views, momentLocalizer, SlotInfo, stringOrDate, View } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment, { Moment } from 'moment'
import 'moment/locale/sk'
import { Cookies } from 'react-cookie'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'

import { Event } from 'types'

import './DnDCalendar.scss'

interface Props {
  events: Event[]
  handleSelectSlot: (slotInfo: SlotInfo) => void
  handleSelectEvent: (event: Object) => void
  handleEventDrop?: (data: {
    start: stringOrDate
    end: stringOrDate
    event: Object
    isAllDay: boolean
  }) => void
  handleEventResize?: (data: {
    event: Object
    start: stringOrDate
    end: stringOrDate
    isAllDay: boolean
  }) => void
  handleChangeTimeRange: (start: Moment, end: Moment, view: View) => void
  eventPropGetter?: (event: Object) => { className?: string; style?: Object }
  draggableAccessor?: (event: Object) => boolean
  height?: string
}

const cookies = new Cookies()
const locale = cookies.get('i18next') || 'en'

if (locale === 'en') {
  moment.updateLocale('en', {
    week: {
      dow: 1,
      // doy: 1,
    },
  })
} else {
  moment.locale(locale)
}

const localizer = momentLocalizer(moment)

// @ts-ignore
const DragAndDropCalendar = withDragAndDrop(Calendar)

const timeSlotWrapper = ({ value, children }: any) => {
  const current = moment().toDate()
  const className = value < current ? 'timeslot-past' : ''
  return React.cloneElement(React.Children.only(children), {
    className: `${children.props.className} ${className}`,
  })
}

const dateCellWrapper = ({ value, children }: any) => {
  const current = moment().toDate()
  const className = value < current ? 'timeslot-past' : ''
  return React.cloneElement(React.Children.only(children), {
    className: `${children.props.className} ${className}`,
  })
}

let initialized = false
const DnDCalendar: React.FC<Props> = ({
  events,
  handleSelectSlot,
  handleSelectEvent,
  handleEventDrop,
  handleEventResize,
  handleChangeTimeRange,
  eventPropGetter,
  draggableAccessor,
  height,
}: Props) => {
  const [view, setView] = useState<View>(Views.WEEK)
  const [currentDate, setCurrentDate] = useState(moment())

  useEffect(() => {
    if (!initialized) {
      initialized = true
      return
    }

    let start, end

    switch (view) {
      case Views.DAY:
        start = moment(currentDate).startOf('day')
        end = moment(currentDate).endOf('day')
        break
      case Views.WEEK:
        start = moment(currentDate).startOf('isoWeek')
        end = moment(currentDate).endOf('isoWeek')
        break
      case Views.MONTH:
        start = moment(currentDate).startOf('month').subtract(7, 'days')
        end = moment(currentDate).endOf('month').add(7, 'days')
        break
      case Views.AGENDA:
        start = moment(currentDate).startOf('day')
        end = moment(currentDate).endOf('day').add(1, 'month')
    }

    if (start && end) handleChangeTimeRange(start, end, view)
  }, [view, currentDate])

  return (
    <DragAndDropCalendar
      popup
      selectable
      resizable
      localizer={localizer}
      events={events}
      onSelectSlot={handleSelectSlot}
      onSelectEvent={handleSelectEvent}
      onEventDrop={handleEventDrop}
      onEventResize={handleEventResize}
      draggableAccessor={draggableAccessor}
      defaultView={Views.WEEK}
      allDayAccessor={() => false}
      eventPropGetter={eventPropGetter}
      onNavigate={(date) => setCurrentDate(moment(date))}
      onView={(view) => setView(view)}
      dayLayoutAlgorithm="overlap"
      style={{ height: height }}
      step={15}
      timeslots={4}
      components={{
        dateCellWrapper,
        timeSlotWrapper,
      }}
    />
  )
}

export default DnDCalendar
