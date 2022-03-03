import React, { useEffect } from 'react'
import { CChart } from '@coreui/react-chartjs'
import Echo from 'laravel-echo'

type Props = {}

//@ts-ignore
window.Pusher = require('pusher-js')

//@ts-ignore
// window.Echo = new Echo({
//   broadcaster: 'pusher',
//   key: process.env.REACT_APP_PUSHER_ENV_KEY,
//   cluster: process.env.REACT_APP_PUSHER_ENV_CLUSTER,
//   // wsHost: process.env.REACT_APP_PUSHER_HOST,
//   wsHost: '147.175.105.186',
//   wsPort: 6001,
//   forceTLS: false,
//   disableStats: true,
// })

const ExperimentGraph: React.FC<Props> = ({}: Props) => {
  let init = false

  // useEffect(() => {
  //   //@ts-ignore
  //   if (!window.Echo) return
  //   //@ts-ignore
  //   window.Echo.channel('channel').listen('DataBroadcaster', (e: any) => {
  //     console.log(e)
  //     if (e.hello) {
  //       console.log(e.hello)
  //     } else {
  //       // probably end of stream
  //     }
  //   })
  // }, [init])
  
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
  const datasets = [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(220, 220, 220, 0.2)',
      borderColor: 'rgba(220, 220, 220, 1)',
      pointBackgroundColor: 'rgba(220, 220, 220, 1)',
      pointBorderColor: '#fff',
      data: [40, 20, 12, 39, 10, 40, 39],
    },

    {
      label: 'My Second dataset',
      backgroundColor: 'rgba(151, 187, 205, 0.2)',
      borderColor: 'rgba(151, 187, 205, 1)',
      pointBackgroundColor: 'rgba(151, 187, 205, 1)',
      pointBorderColor: '#fff',
      data: [50, 12, 28, 29, 7, 25, 12],
    },
  ]

  return (
    <CChart
      type="line"
      options={{
        // animation: false,
      }}
      data={{
        labels,
        datasets,
      }}
    />
  )
}

export default React.memo(ExperimentGraph)
