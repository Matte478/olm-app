import CIcon from '@coreui/icons-react'
import { DeviceWithReservationsFragment, ReservationBasicFragment } from '__generated__/graphql'

export interface SidebarNavItemBadge {
  color:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark'
    | 'light'
    | string
  text: string
}

export interface SidebarNavItem {
  component: React.ForwardRefExoticComponent<any>
  name: string
  permission?: string | string[]
  to?: string
  icon?: CIcon
  badge?: SidebarNavItemBadge
  items?: SidebarNavItem[]
}

export interface TableColumn {
  column: string
  name: string
  style?: object
}

export interface TableColumnsNested {
  key: string
  name: string
  columns: TableColumn[]
}

export interface TableAction {
  handleClick: (id: string) => void
  color:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark'
    | 'light'
    | string
  text?: string
  textColor?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark'
    | 'light'
    | string
  icon?: CIcon
  permission?: string | string[]
  onDeleted?: boolean
  onNonDeleted?: boolean
}

export interface Event {
  // id: string
  title: string
  start: Date
  end: Date
}

export interface Reservation {
  id: number
  title: string
  start: Date
  end: Date
}

export interface ReservationWithDeviceId extends ReservationBasicFragment {
  device_id: string
}

export interface DeviceWithReservationsExtended extends DeviceWithReservationsFragment {
  production: boolean
}

export interface PlaceholderReservation {
  title: string
  start: Date
  end: Date
}
