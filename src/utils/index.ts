const formatDeviceName = (device: any) => {
  const availableSoftware = device.software.map((software: any) => software.name).join(', ')

  return `${device.name} - ${availableSoftware}`
}

export { formatDeviceName }
