import React from 'react'
import { Calendar, Views, momentLocalizer, SlotInfo, stringOrDate } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'
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
  eventPropGetter?: (event: Object) => { className?: string; style?: Object }
  height?: string
}

const cookies = new Cookies()
moment.locale(cookies.get('i18next') || 'en')
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

const DnDCalendar = ({
  events,
  handleSelectSlot,
  handleSelectEvent,
  handleEventDrop,
  handleEventResize,
  eventPropGetter,
  height,
}: Props) => {
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
      defaultView={Views.WEEK}
      style={{ height: height }}
      allDayAccessor={() => false}
      eventPropGetter={eventPropGetter}
      dayLayoutAlgorithm="overlap"
      components={{
        dateCellWrapper,
        timeSlotWrapper,
      }}
    />
  )
}

export default DnDCalendar
