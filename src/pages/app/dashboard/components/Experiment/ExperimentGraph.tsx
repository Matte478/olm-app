import React, { useEffect } from 'react'
import Echo from 'laravel-echo'
import PlotlyChart from 'react-plotly.js'

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

  return (
    <PlotlyChart
      data={[
        {
          x: [1, 2, 3],
          y: [2, 6, 3],
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'blue' },
        },
        {
          x: [1, 2, 3],
          y: [1, 3, 9],
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'red' },
        },
      ]}
      layout={{ title: 'A Fancy Plot' }}
    />
  )
}

export default React.memo(ExperimentGraph)
