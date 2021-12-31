import { DeviceBasicFragment, SoftwareBasicFragment } from '__generated__/graphql'

const formatDeviceName = (device: DeviceBasicFragment) => {
  const availableSoftware = device.software
    .map((software: SoftwareBasicFragment) => software.name)
    .join(', ')

  return `${device.name} - ${availableSoftware}`
}

export { formatDeviceName }
