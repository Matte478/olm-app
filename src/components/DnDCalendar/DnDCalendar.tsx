import React from 'react'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'
import 'moment/locale/sk'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'

import { Event } from 'types'
import { Cookies } from 'react-cookie'

interface Props {
  events: Event[]
  handleCreateEvent: (event: any) => any
  height?: string
}

const cookies = new Cookies()
moment.locale(cookies.get('i18next') || 'en')
const localizer = momentLocalizer(moment)

// @ts-ignore
const DragAndDropCalendar = withDragAndDrop(Calendar)

class DnDCalendar extends React.Component<Props> {
  render() {
    return (
      <DragAndDropCalendar
        popup
        selectable
        resizable
        localizer={localizer}
        events={this.props.events}
        onEventDrop={console.log}
        onEventResize={console.log}
        onSelectSlot={this.props.handleCreateEvent}
        onSelectEvent={console.log}
        // onDragStart={console.log}
        defaultView={Views.WEEK}
        style={{ height: this.props.height }}
      />
    )
  }
}

export default DnDCalendar
