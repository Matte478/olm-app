import React from 'react'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'
import 'moment/locale/sk'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import { Event } from 'types'
import { Cookies } from 'react-cookie'

interface DnD {
  events: Event[]
}

interface Props {
  events: Event[]
  handleCreateEvent: (event: any) => Promise<boolean>
}

const cookies = new Cookies()
moment.locale(cookies.get('i18next') || 'en')
const localizer = momentLocalizer(moment)

// @ts-ignore
const DragAndDropCalendar = withDragAndDrop(Calendar)

class DnDCalendar extends React.Component<Props, DnD> {
  constructor(props: any) {
    super(props)
    this.state = {
      events: this.props.events,
    }

    this.moveEvent = this.moveEvent.bind(this)
  }

  handleSelect = ({ start, end }: any) => {
    const title = window.prompt('New Event name')
    if (!title) return

    const { events } = this.state

    const id = events.length !== 0 ? Math.max(...events.map((event) => event.id)) + 1 : 0
    const newEvent = { id, title, start, end }

    this.props.handleCreateEvent(newEvent).then((success) => {
      if (success) {
        this.setState({
          events: [...events, newEvent],
        })
      }
    })
  }

  moveEvent({ event, start, end, isAllDay: droppedOnAllDaySlot }: any) {
    const { events } = this.state

    const idx = events.indexOf(event)

    let allDay = event.allDay
    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false
    }

    const updatedEvent = { ...event, start, end, allDay }

    const nextEvents = [...events]
    nextEvents.splice(idx, 1, updatedEvent)

    this.setState({
      events: nextEvents,
    })
  }

  resizeEvent = ({ event, start, end }: any) => {
    const { events } = this.state

    const nextEvents = events.map((existingEvent) => {
      return existingEvent.id === event.id ? { ...existingEvent, start, end } : existingEvent
    })

    this.setState({
      events: nextEvents,
    })
  }

  render() {
    return (
      <DragAndDropCalendar
        selectable
        localizer={localizer}
        events={this.state.events}
        onEventDrop={this.moveEvent}
        resizable
        onEventResize={this.resizeEvent}
        onSelectSlot={this.handleSelect}
        onDragStart={console.log}
        defaultView={Views.MONTH}
        style={{ height: 500 }}
      />
    )
  }
}

export default DnDCalendar
